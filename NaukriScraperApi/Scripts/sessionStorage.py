from playwright.sync_api import sync_playwright
import sys

def save_session(user_id):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Run with GUI
        page = browser.new_page()

        # Navigate to Naukri login page
        page.goto("https://www.naukri.com")

        print(f"👤 Please log in for user: {user_id}")
        input("Press Enter after logging in...")

        # Save session storage
        storage_path = f"storage/{user_id}_naukri.json"
        page.context.storage_state(path=storage_path)
        print(f"✅ Session saved at: {storage_path}")

        browser.close()

if __name__ == "__main__":
    user_id = sys.argv[1]  # Accept user ID as an argument
    save_session(user_id)
