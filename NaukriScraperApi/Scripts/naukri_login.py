# import os
# import hashlib
# from playwright.sync_api import sync_playwright

# BASE_SESSION_DIR = "naukri_sessions"

# def get_user_data_dir(user_id):
#     """Generates a user-specific session directory."""
#     user_hash = hashlib.md5(user_id.encode()).hexdigest()
#     return os.path.abspath(os.path.join(BASE_SESSION_DIR, user_hash))

# def naukri_login(user_id):
#     """Handles Naukri login and saves session."""
#     user_data_dir = get_user_data_dir(user_id)
#     os.makedirs(user_data_dir, exist_ok=True)

#     with sync_playwright() as p:
#         browser = p.chromium.launch_persistent_context(
#             user_data_dir,
#             channel="chrome",
#             headless=False
#         )
#         page = browser.new_page()
#         page.goto("https://www.naukri.com/mnjuser/homepage", timeout=30000)
#         #page.wait_for_selector(".login-wrapper")
#         # Check if already logged in
#         try:
#             page.wait_for_selector(".login-wrapper", timeout=50000)
    
#             try:
#                 page.wait_for_selector(".user-details-inner", timeout=30000)
#                 print("Login successful! Session saved.")
#             except Exception as e:
#                 print(f"Login detection failed")

#         except Exception:
#             print("Already logged in! Session saved.") 

           

#         browser.close()

# # Entry point for manual login
# if __name__ == "__main__":
#     import sys
#     user_id = sys.argv[1]
#     naukri_login(user_id)



import os
import json
import hashlib
import sys
from playwright.sync_api import sync_playwright

BASE_SESSION_DIR = "naukri_sessions"

def get_user_data_dir(user_id):
    """Generates a user-specific session directory."""
    user_hash = hashlib.md5(user_id.encode()).hexdigest()
    return os.path.abspath(os.path.join(BASE_SESSION_DIR, user_hash))

def naukri_login(user_id):
    """Handles Naukri login and saves session."""
    user_data_dir = get_user_data_dir(user_id)
    os.makedirs(user_data_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir,
            channel="chrome",
            headless=False
        )
        page = browser.new_page()
        page.goto("https://www.naukri.com/mnjuser/homepage", timeout=30000)

        try:
            page.wait_for_selector(".login-wrapper", timeout=50000)
            try:
                page.wait_for_selector(".user-details-inner", timeout=30000)
                response = {"status": "success", "message": "Login successful! Session saved."}
            except:
                response = {"status": "error", "message": "Login detection failed."}
        except:
            response = {"status": "success", "message": "Already logged in! Session saved."}

        browser.close()
    print(json.dumps(response))


if __name__ == "__main__":
    user_id = sys.argv[1]
    naukri_login(user_id)
