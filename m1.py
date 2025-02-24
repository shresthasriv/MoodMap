import mysql.connector
from mysql.connector import Error
import os
import time
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import (
    TextAnalyticsClient,
    ExtractKeyPhrasesAction,
    AnalyzeSentimentAction,
)

# Load Azure credentials from environment variables for security
endpoint = "API_ENDPOINT"
key = "API_KEY"

# Initialize Azure Text Analytics client
text_analytics_client = TextAnalyticsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(key),
)

# Database connection function
def create_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='root1',
        database='reviewsdb'
    )

# Fetch reviews from the processing queue
def fetch_pending_reviews():
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT pq.review_id, t1.ReviewText 
        FROM processing_queue pq
        INNER JOIN table_1 t1 ON pq.review_id = t1.ID
    """)
    reviews = cursor.fetchall()
    connection.close()
    return reviews

# Store processed results in the processed_reviews table
def store_processed_results(results):
    connection = create_connection()
    cursor = connection.cursor()
    query = """
    INSERT INTO processed_reviews 
    (original_review, key_phrases, sentiment_value, positive_score, neutral_score, negative_score) 
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(query, results)
    connection.commit()
    connection.close()

# Remove processed reviews from the processing queue
def delete_from_queue(review_ids):
    connection = create_connection()
    cursor = connection.cursor()
    query = "DELETE FROM processing_queue WHERE review_id IN (%s)"
    formatted_query = query % ",".join(["%s"] * len(review_ids))
    cursor.execute(formatted_query, review_ids)
    connection.commit()
    connection.close()

# Main loop to fetch, process, and store reviews
while True:
    print("Fetching and processing new reviews...")
    pending_reviews = fetch_pending_reviews()

    if pending_reviews:
        # Prepare documents for Azure Text Analytics
        documents = [review['ReviewText'] for review in pending_reviews]

        # Analyze using Azure Cognitive Services
        poller = text_analytics_client.begin_analyze_actions(
            documents,
            display_name="Sentiment Analysis and Key Phrase Extraction",
            actions=[
                ExtractKeyPhrasesAction(),
                AnalyzeSentimentAction(),
            ],
        )

        processed_results = []
        processed_ids = []
        for doc, action_results in zip(pending_reviews, poller.result()):
            review_id = doc['review_id']
            original_review = doc['ReviewText']
            key_phrases = []
            sentiment_value = None
            positive_score = neutral_score = negative_score = None

            for result in action_results:
                if result.kind == "KeyPhraseExtraction" and not result.is_error:
                    key_phrases = ", ".join(result.key_phrases)
                elif result.kind == "SentimentAnalysis" and not result.is_error:
                    sentiment_value = result.sentiment
                    positive_score = result.confidence_scores.positive
                    neutral_score = result.confidence_scores.neutral
                    negative_score = result.confidence_scores.negative

            processed_results.append((
                original_review,
                key_phrases,
                sentiment_value,
                positive_score,
                neutral_score,
                negative_score,
            ))
            processed_ids.append(review_id)

        # Store results and clean up the queue
        store_processed_results(processed_results)
        delete_from_queue(processed_ids)

        print(f"Processed and stored {len(processed_results)} reviews.")

    else:
        print("No new reviews to process.")

    # Sleep for 1 minute before the next iteration
    print("Sleeping for 1 minute...")
    time.sleep(60)

