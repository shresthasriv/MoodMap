from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import csv
import time

def scrape_quotes():
    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run in headless mode
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    # Initialize the Chrome WebDriver
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Navigate to the quotes website
        driver.get('http://quotes.toscrape.com')
        
        # List to store all quotes
        quotes = []
        
        while True:
            # Wait for quotes to load
            quote_elements = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "quote"))
            )
            
            # Extract quotes from current page
            for quote in quote_elements:
                text = quote.find_element(By.CLASS_NAME, "text").text
                quotes.append([text])
            
            try:
                # Try to click the "Next" button
                next_button = driver.find_element(By.CLASS_NAME, "next")
                next_link = next_button.find_element(By.TAG_NAME, "a")
                next_link.click()
                
                # Add a small delay to prevent rate limiting
                time.sleep(1)
            except:
                # No more pages to scrape
                break
        
        # Save quotes to CSV
        with open('mh/quotes_text.csv', 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerows(quotes)
            
        print(f"Successfully scraped {len(quotes)} quotes and saved to quotes_text.csv")
            
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_quotes()
