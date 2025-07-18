import time
import json
import sys
import os
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from naukri_login import get_user_data_dir
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


def callGemini(profileSummary, question):
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"""
You are given a user profile summary and a question. Answer the question using only the required word(s), without any explanation or extra context.

Profile Summary: {profileSummary}  
Question: {question}  

Strict Answering Guidelines:
1. Your answer must match the **semantic type** expected by the question (e.g., string, number, date).
2. **One-word answers only**, unless a longer answer is clearly required (e.g., a full location).
3. For **Notice Period** questions:
   - If the exact notice period is not in the options, choose the **closest matching value** from the user profile.
4. For **Experience** questions:
   - Respond with a **numeric value only** (e.g., `5` for 5 years), without any text or units.
   - In case the Experience for a perticularly asked question is not available in the profile return 0.
5. If you **can’t find an exact answer**, **create the most appropriate positive answer** using the profile summary.
6. For **Location** questions:
   - Use the **Preferred Location** or **Current Location** from the profile.
7. Do **not return "undefined", "unknown", or "N/A"**. Always provide a best-fit or inferred answer.
8. Match the **data type** in the user profile (numeric stays numeric, string stays string).
9. For **Date** questions:
   - Use the format **DD/MM/YYYY** only.
   - Do not include time or time zones.
10. For the questions that ask you whether you are willing to relocate to a specific location, give positive response as Yes.
11. If asked for a goverment ID or Goverment ID number, give NA as answer.
12. For Nouns like name, give first letter capital letter for each word, and rest of letters in small case.
13. If a question is completly unseen, give the nearest answer possible.

Answer Format:
- Provide only the **final answer**, with **no extra words, punctuation, or context**.
        """,
    )
    return response.text.strip() if response.text else None


def is_logged_in(page):
    page.goto("https://www.naukri.com/mnjuser/homepage", timeout=10000)
    return bool(page.query_selector(".user-details-inner"))


def process_questionnaire(page, user_profile_summary):
    def submit_answer():
        submit_button = page.query_selector(".sendMsg")
        if submit_button:
            submit_button.click()
            time.sleep(2)

    while page.query_selector(".chatbot_DrawerContentWrapper"):
        page.wait_for_selector(".botMsg div span", timeout=10000)
        question_elements = page.query_selector_all(".botMsg div span")
        if not question_elements:
            break

        skip_chip = page.query_selector("div.chatbot_Chip span:text('Skip this question')")
        if skip_chip:
            skip_chip.click()
            time.sleep(2)
            continue

        latest_question = question_elements[-1].inner_text().strip()

        # --- Handle Multi-Checkbox ---
        if page.query_selector(".multicheckboxes-container"):
            checkbox_labels = page.query_selector_all(".multicheckboxes-container .mcc__label")
            options = [label.inner_text().strip() for label in checkbox_labels]
            answer = callGemini(user_profile_summary, latest_question + " Options: " + ", ".join(options))
            selected_options = [opt.strip().lower() for opt in answer.split(",")]
            for label in checkbox_labels:
                if label.inner_text().strip().lower() in selected_options:
                    label.click()
            time.sleep(1)
            submit_answer()
            continue

        # --- Handle Radio Options ---
        elif page.query_selector(".singleselect-radiobutton input[type='radio']"):
            radio_labels = page.query_selector_all(".singleselect-radiobutton label")
            options = [lbl.inner_text().strip() for lbl in radio_labels]
            answer = callGemini(user_profile_summary, latest_question + " Options: " + ", ".join(options))
            for label in radio_labels:
                if label.inner_text().strip().lower() == answer.lower():
                    label.click()
                    break
            time.sleep(1)
            submit_answer()
            continue

        # --- Handle Multi-Select Suggestor Chips ---
        elif page.query_selector(".multi-select-suggestor"):
            chip_elements = page.query_selector_all(".msc__unselected-chip")
            options = [chip.get_attribute("data-chiptext") for chip in chip_elements]
            answer = callGemini(user_profile_summary, latest_question + " Options: " + ", ".join(options))
            selected_options = [opt.strip().lower() for opt in answer.split(",")]
            for chip in chip_elements:
                chip_text = chip.get_attribute("data-chiptext").lower()
                if chip_text in selected_options:
                    chip.click()
            time.sleep(1)
            submit_answer()
            continue

        # --- Handle multiselectcheckboxes style questions ---
        elif page.query_selector(".multiselectcheckboxes"):
            checkbox_labels = page.query_selector_all(".multicheckboxes-container .mcc__label")
            options = [label.inner_text().strip() for label in checkbox_labels if label.inner_text().strip()]
            answer = callGemini(
                user_profile_summary,
                latest_question + " Options: " + ", ".join(options)
            )
            selected_options = [opt.strip().lower() for opt in answer.split(",")]
            for label in checkbox_labels:
                if label.inner_text().strip().lower() in selected_options:
                    # click the corresponding checkbox input
                    checkbox_id = label.get_attribute("for")
                    checkbox_input = page.query_selector(f"input#{checkbox_id}")
                    if checkbox_input:
                        checkbox_input.click()
            time.sleep(1)
            submit_answer()
            continue


        elif page.query_selector(".chatbot_Chip.chipInRow"):
            chip_elements = page.query_selector_all(".chatbot_Chip.chipInRow")
            options = [chip.inner_text().strip() for chip in chip_elements]
            answer = callGemini(user_profile_summary, latest_question + " Options: " + ", ".join(options))
            for chip in chip_elements:
                if chip.inner_text().strip().lower() == answer.lower():
                    chip.click()
                    break
            time.sleep(1)
            submit_answer()
            continue

        # --- Handle Multi-Select Chips (chatbot_Chip.chipInRow style) ---
        elif page.query_selector(".chatbot_Chip.chipInRow"):
            chip_elements = page.query_selector_all(".chatbot_Chip.chipInRow")
            options = [chip.inner_text().strip() for chip in chip_elements if chip.inner_text().strip()]
            answer = callGemini(user_profile_summary, latest_question + " Options: " + ", ".join(options))
            selected_options = [opt.strip().lower() for opt in answer.split(",")]

            for chip in chip_elements:
                chip_text = chip.inner_text().strip().lower()
                if chip_text in selected_options:
                    chip.click()

            time.sleep(1)
            submit_answer()
            continue


        # --- Handle Text/Short Answer ---
        else:
            options = page.query_selector_all(".ssrc__label")
            if options:
                latest_question += " Options: " + ", ".join(opt.inner_text().strip() for opt in options)
            answer = callGemini(user_profile_summary, latest_question)
            input_field = page.query_selector(".chatbot_InputContainer")
            if input_field:
                page.keyboard.type(answer)
                time.sleep(1)
                submit_answer()


def auto_apply_jobs(user_id, job_data_str, user_profile_summary):
    jobs_list = []
    jobs = [
        job.split(",") for job in job_data_str.split("|") if len(job.split(",")) >= 2
    ]
    user_data_dir = get_user_data_dir(user_id)
    if not os.path.exists(user_data_dir):
        print("No session found! Please log in first.")
        return json.dumps([])

    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir, channel="chrome", headless=False
        )
        page = browser.new_page()

        if not is_logged_in(page):
            print("User not logged in! Please log in first.")
            browser.close()
            return json.dumps([])

        for job_id, job_link, *extra in jobs:
            current_user_id = extra[0] if extra else user_id

            try:
                page.goto(job_link, timeout=15000)
                page.wait_for_timeout(3000)

                if page.query_selector(".already-applied"):
                    status = "Applied"
                else:
                    apply_button = page.query_selector(".apply-button")
                    if apply_button:
                        apply_button.click()
                        time.sleep(3)

                        if page.query_selector(".chatbot_DrawerContentWrapper"):
                            process_questionnaire(page, user_profile_summary)

                            # Wait for chat drawer to close
                            page.wait_for_selector(".chatbot_DrawerContentWrapper", state="detached", timeout=10000)
                            time.sleep(2)

                        success_msg = page.query_selector(".apply-status-header")
                        status = "Applied" if success_msg else "Not Applied"
                    else:
                        status = "Apply on Company Portal"

                jobs_list.append(
                    {"jobId": job_id, "userId": int(current_user_id), "status": status}
                )

            except Exception as e:
                jobs_list.append(
                    {"jobId": job_id, "userId": int(current_user_id), "status": "Error"}
                )

        browser.close()

    print(json.dumps(jobs_list, ensure_ascii=False))


if __name__ == "__main__":
    user_id = sys.argv[1]
    job_data_str = sys.argv[2]
    user_profile_summary = sys.argv[3]
    result = auto_apply_jobs(user_id, job_data_str, user_profile_summary)
