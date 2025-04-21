import time
import json
import sys
import os
import hashlib
from playwright.sync_api import sync_playwright
from naukri_login import get_user_data_dir

start_time = time.time()
def is_logged_in(page):

    page.goto("https://www.naukri.com/mnjuser/homepage", timeout=10000)
    return bool(page.query_selector(".user-details-inner"))

def scrape_jobs(user_id, role, experience, location, noOfJobs):
    MAX_JOBS = int(noOfJobs)
    jobs_list = []
    job_count = 0  

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

        # Check if already logged in
        if not is_logged_in(page):
            print("⚠️ User not logged in! Please log in first using `naukri_login.py`.")
            browser.close()
            return json.dumps([])

       
        page.goto("https://www.naukri.com")
        page.click(".nI-gNb-sb__main")
        page.locator('.nI-gNb-sb__main >> input').nth(0).fill(role)
        page.click(".dropdownMainContainer")
        page.click(f"text={experience}")
        page.locator('.nI-gNb-sb__main >> input').nth(2).fill(location)
        page.click(".nI-gNb-sb__icon-wrapper")
        page.wait_for_timeout(3000) 

        page_number = 1 

        while job_count < MAX_JOBS:
            job_elements = page.query_selector_all(".srp-jobtuple-wrapper")

            for job in job_elements:
                if job_count >= MAX_JOBS:
                    break

                job_id = job.get_attribute("data-job-id") or "N/A"
                title = job.query_selector(".title").inner_text() if job.query_selector(".title") else "N/A"
                company = job.query_selector(".comp-name").inner_text() if job.query_selector(".comp-name") else "N/A"
                exp = job.query_selector(".exp").inner_text() if job.query_selector(".exp") else "N/A"
                loc = job.query_selector(".locWdth").inner_text() if job.query_selector(".locWdth") else "N/A"
                link = job.query_selector("a.title").get_attribute("href") if job.query_selector("a.title") else None

                
                description = "N/A"
                if link:
                    with browser.new_page() as job_page:
                        job_page.goto(link)
                        job_page.wait_for_timeout(2000)
                        description_element = job_page.query_selector(".styles_JDC__dang-inner-html__h0K4t")
                        if description_element:
                            try:
                                description = description_element.inner_text()
                            except Exception as e:
                                print()

                jobs_list.append({
                    "jobId": job_id,
                    "jobTitle": title,
                    "companyName": company,
                    "experienceRequired": exp,
                    "Location": loc,
                    "Link": link,
                    "jobDescription": description
                })

                job_count += 1  

            if job_count >= MAX_JOBS:
                break

            
            next_buttons = page.query_selector_all("a.styles_btn-secondary__2AsIP")
            next_button = None
            for btn in next_buttons:
                if btn.inner_text().strip().lower() == "next":
                    next_button = btn
                    break

            if next_button and next_button.is_visible():
                next_button.click()
                page.wait_for_timeout(5000)  
                page_number += 1
            else:
                break

        browser.close()
        print(json.dumps(jobs_list, ensure_ascii=False))


# Entry point
if __name__ == "__main__":
    user_id = sys.argv[1]
    job_role = sys.argv[2]
    experience = sys.argv[3]
    location = sys.argv[4]
    noOfJobs = sys.argv[5]
    result = scrape_jobs(user_id, job_role, experience, location, noOfJobs)
