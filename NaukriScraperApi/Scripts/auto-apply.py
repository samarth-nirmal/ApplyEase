# import time
# import json
# import sys
# import os
# from playwright.sync_api import sync_playwright
# from naukri_login import get_user_data_dir
# from google import genai

# client = genai.Client(api_key="AIzaSyCqKr7pRlibbMekjes3a-T4un1lC_hy8sM")

# def callGemini(profileSummary, question):
#     response = client.models.generate_content(
#     model="gemini-2.0-flash", contents=f''' Based On the following question and the user profile summary answer the question in just required words e.g (Only one word response), Profile Summary - {profileSummary}, The Question - {question}'''
#     )
#     return response.text

# start_time = time.time()

# def is_logged_in(page):
#     """ Check if the user is logged in """
#     page.goto("https://www.naukri.com/mnjuser/homepage", timeout=10000)
#     return bool(page.query_selector(".user-details-inner"))

# def auto_apply_jobs(user_id, job_data_str, user_profile_summary):
#     """ Automatically applies to jobs based on stored session """
#     jobs_list = []
    
#     # Ensure job_data_str is correctly formatted
#     jobs = [job.split(",") for job in job_data_str.split("|")]

#     # Validate input (each job must have at least job_id and job_link)
#     jobs = [job for job in jobs if len(job) >= 2]  

#     user_data_dir = get_user_data_dir(user_id)
#     if not os.path.exists(user_data_dir):
#         print("⚠️ No session found! Please log in first using `naukri_login.py`.")
#         return json.dumps([])

#     with sync_playwright() as p:
#         browser = p.chromium.launch_persistent_context(
#             user_data_dir, 
#             channel="chrome",
#             headless=False
#         )
#         page = browser.new_page()

#         # Check if already logged in
#         if not is_logged_in(page):
#             print("⚠️ User not logged in! Please log in first using `naukri_login.py`.")
#             browser.close()
#             return json.dumps([])

#         for job in jobs:
#             job_id, job_link = job[:2]  # Extract first two elements
#             current_user_id = job[2] if len(job) > 2 else user_id  # Use passed user_id if missing

#             page.goto(job_link, timeout=15000)
#             time.sleep(2)  # Let the page load

#             # Check if Apply button exists
#             apply_button = page.query_selector(".apply-button")  # Adjust selector as needed
#             if apply_button:
#                 apply_button.click()
#                 time.sleep(5)  # Allow time for Apply process
                
#                 # Check if chatbot popup exists and close it
#                 if page.query_selector(".chatbot_DrawerContentWrapper"):
#                     while True:
#                         question_elements = page.query_selector_all(".botMsg div span")
#                         if 'thank you for showing interest. Kindly answer all the recruiter\'s questions to successfully apply for the job.' in question_elements[0].inner_text():
#                             question_index = 1
#                         else:
#                             question_index = 0
                        
#                         if question_index < len(question_elements):
#                             question_text = question_elements[question_index].inner_text()
#                             question_index += 1  # Move to the next question in the next iteration
#                         else:
#                             break  # Exit loop if no more questions are found

#                         print(question_text)
#                         answer = callGemini(user_profile_summary, question_text)
#                         print(answer)
#                         time.sleep(2)  # Wait for the answer to be generated

#                         # Find the input field and submit the answer
#                         page.focus(".chatbot_InputContainer")
#                         page.keyboard.type(answer)
#                         submit_button = page.query_selector(".sendMsg")  # Adjust selector as needed
#                         if submit_button:
#                             time.sleep(5)  # Allow time for the next question to load
#                             submit_button.click()
#                             time.sleep(5)

#                     # Check if application is successful
#                 success_msg = page.query_selector(".apply-message")  # Adjust selector as needed
#                 if success_msg and "You have successfully applied to" in success_msg.inner_text():
#                     status = "Applied"
#                 else:
#                     status = "Not Applied"
#             else:
#                 status = "Apply on Company Portal"

#             jobs_list.append({
#                 "jobId": job_id,
#                 "userId": current_user_id,
#                 "status": status
#             })

#         browser.close()

#     print(json.dumps(jobs_list, ensure_ascii=False))
#     return json.dumps(jobs_list, indent=4, ensure_ascii=False)

# # Entry point
# if __name__ == "__main__":
#     user_id = sys.argv[1]
#     job_data_str = sys.argv[2]
#     user_profile_summary = sys.argv[3]
#     result = auto_apply_jobs(user_id, job_data_str, user_profile_summary)


import time
import json
import sys
import os
from playwright.sync_api import sync_playwright
from naukri_login import get_user_data_dir
from google import genai

client = genai.Client(api_key="AIzaSyCqKr7pRlibbMekjes3a-T4un1lC_hy8sM")

def callGemini(profileSummary, question):
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"""
            Based on the following question and the user profile summary, answer the question in just required words,
            e.g., (Only one-word response). 
            Profile Summary - {profileSummary}
            The Question - {question}
            If you are unable to find an answer, Makeup an answer based on profile summary which will be the closest to the user Profile
            If any job is asking a Experience related question give only a numeric value output.
            Try to give positive answers to the question you cant find a answer for.
            If asked a location based question, give location mentioned in the profile in Preffered location or current location as answer if you cant find the exact answer.
            Don't change the type of output. If in userPorfile something is given in numeric keep it numeric. If something is string keep it string
        """
    )
    return response.text.strip() if response.text else None

start_time = time.time()

def is_logged_in(page):
    """Check if the user is logged in"""
    page.goto("https://www.naukri.com/mnjuser/homepage", timeout=10000)
    return bool(page.query_selector(".user-details-inner"))

def auto_apply_jobs(user_id, job_data_str, user_profile_summary):
    """Automatically applies to jobs based on stored session"""
    jobs_list = []
    
    # Ensure job_data_str is correctly formatted
    jobs = [job.split(",") for job in job_data_str.split("|")]
    jobs = [job for job in jobs if len(job) >= 2]  # Validate input

    user_data_dir = get_user_data_dir(user_id)
    if not os.path.exists(user_data_dir):
        print("⚠️ No session found! Please log in first using `naukri_login.py`.")
        return json.dumps([])

    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir, 
            channel="chrome",
            headless=False
        )
        page = browser.new_page()

        if not is_logged_in(page):
            print("⚠️ User not logged in! Please log in first using `naukri_login.py`.")
            browser.close()
            return json.dumps([])

        for job in jobs:
            job_id, job_link = job[:2]
            current_user_id = job[2] if len(job) > 2 else user_id

            page.goto(job_link, timeout=15000)
            time.sleep(2)

            apply_button = page.query_selector(".apply-button")  # Adjust selector as needed
            if apply_button:
                button_text = apply_button.inner_text().strip() 
                print(button_text)
                if button_text.lower() == "applied":
                    status = 'Applied'
                    continue
                else:    
                    apply_button.click()
                    time.sleep(5)
                    hasDrawer = False

                if page.query_selector(".chatbot_DrawerContentWrapper"):
                    hasDrawer = True
                    first_question = True
                    
                    while page.query_selector(".chatbot_DrawerContentWrapper"):
                        page.wait_for_selector(".botMsg div span", timeout=10000)
                        question_elements = page.query_selector_all(".botMsg div span")
                        
                        if not question_elements:
                            break

                        if question_elements:
                            latest_question = question_elements[-1].inner_text().strip()  # Take the last/latest message
                            print("Latest Question:", latest_question)

                        # if first_question and "thank you for showing interest" in question_elements[0].inner_text().lower():
                        #     question_index = 1
                        # else:
                        #     question_index = 0

                        # if question_index >= len(question_elements):
                        #     break
                        radio_options_container = page.query_selector_all(".singleselect-radiobutton-container")


                        if radio_options_container:
                                labels = [label.inner_text().strip() for label in page.query_selector_all(".ssrc__label")]
                                options_text = " Options: " + ", ".join(labels)
                                latest_question += options_text  # Append options to the question
                        
                       # question_text = question_elements[question_index].inner_text().strip()
                        print("Question:", latest_question)
                        first_question = False

                        # Generate answer
                        answer = callGemini(user_profile_summary, latest_question)
                        print("Answer:", answer)
                        time.sleep(2)


                        radio_options = page.query_selector_all(".singleselect-radiobutton input[type='radio']")
                        radio_selected = False

                        if radio_options:
                            for radio in radio_options:
                                print(radio)
                                if radio.get_attribute("value").lower() == answer.lower():
                                    innerText = radio.get_attribute("value")
                                    page.locator(f".singleselect-radiobutton label:has-text('{innerText}')").first.click()
                                    radio_selected = True
                                    break

                        elif page.query_selector(".chatbot_InputContainer"):
                            print("Text Box")
                            # Enter answer in text input
                            input_field = page.query_selector(".chatbot_InputContainer")
                            if input_field:
                                page.focus(".chatbot_InputContainer")
                                page.keyboard.type(answer)
                            else:
                                print("❌ No valid input field found. Exiting loop.")
                                break  # Exit loop if input field is missing
                        
                        # Wait and re-fetch the submit button before clicking
                        time.sleep(3)
                        submit_button = page.query_selector(".sendMsg")

                        if submit_button:
                            submit_button.click()
                            print("Submitted answer. Waiting for next question...")
                            time.sleep(3)
                        else:
                            print("Submit button not found! Exiting loop.")
                            break
                if hasDrawer:
                    time.sleep(2.5)


                success_msg = page.query_selector(".apply-status-header")  # Adjust selector as needed
                status = "Applied" if success_msg and "You have successfully applied to" in success_msg.inner_text() else "Not Applied"
            else:
                status = "Apply on Company Portal"

            jobs_list.append({
                "jobId": job_id,
                "userId": current_user_id,
                "status": status
            })
        
        browser.close()

    print(json.dumps(jobs_list, ensure_ascii=False))
    return json.dumps(jobs_list, indent=4, ensure_ascii=False)

# Entry point
if __name__ == "__main__":
    user_id = sys.argv[1]
    job_data_str = sys.argv[2]
    user_profile_summary = sys.argv[3]
    result = auto_apply_jobs(user_id, job_data_str, user_profile_summary)
