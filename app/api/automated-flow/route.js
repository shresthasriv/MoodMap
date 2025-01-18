import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Azure credentials
const key = "2XtvBZ9DlUcpHNYYft9jBcfAmJwGJhGuzFnvdRdNyjChgMUzAXQYJQQJ99BAACGhslBXJ3w3AAAaACOG0plA";
const endpoint = "https://db2022903.cognitiveservices.azure.com/";

async function analyzeSentiment(documents) {
  const response = await fetch(`${endpoint}text/analytics/v3.0/sentiment`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documents: documents.map((text, index) => ({
        id: index.toString(),
        language: 'en',
        text
      }))
    })
  });

  return response.json();
}

async function extractKeyPhrases(documents) {
  const response = await fetch(`${endpoint}text/analytics/v3.0/keyPhrases`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documents: documents.map((text, index) => ({
        id: index.toString(),
        language: 'en',
        text
      }))
    })
  });

  return response.json();
}

export async function GET() {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'quotes_text.csv');
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    
    // Parse CSV content - assuming one column of text
    const reviews = fileContent.split('\n')
      .map(line => line.trim())
      .filter(line => line && line.length > 0);

    // Process in batches of 10 (Azure limit)
    const batchSize = 10;
    let sentimentResults = [];
    let keyPhraseResults = [];

    for (let i = 0; i < reviews.length; i += batchSize) {
      const batch = reviews.slice(i, i + batchSize);
      
      // Get sentiments
      const sentimentResponse = await analyzeSentiment(batch);
      sentimentResults.push(...sentimentResponse.documents);

      // Get key phrases
      const keyPhrasesResponse = await extractKeyPhrases(batch);
      keyPhraseResults.push(...keyPhrasesResponse.documents);
    }

    // Process results
    let positive = 0, negative = 0, neutral = 0;
    const keywords = new Map();
    const keywordSentiments = new Map();

    sentimentResults.forEach((result, index) => {
      const sentiment = result.sentiment;
      const keyPhrases = keyPhraseResults[index].keyPhrases;

      // Count sentiments
      if (sentiment === 'positive') positive++;
      else if (sentiment === 'negative') negative++;
      else if (sentiment === 'neutral') neutral++;

      // Process keywords with sentiments
      keyPhrases.forEach(phrase => {
        const trimmed = phrase.trim();
        keywords.set(trimmed, (keywords.get(trimmed) || 0) + 1);
        
        if (!keywordSentiments.has(trimmed)) {
          keywordSentiments.set(trimmed, {
            positive: 0,
            negative: 0,
            neutral: 0
          });
        }
        keywordSentiments.get(trimmed)[sentiment.toLowerCase()]++;
      });
    });

    // Calculate percentages
    const total = positive + negative + neutral;
    const pieData = [
      { name: 'Positive', value: positive, percentage: ((positive/total) * 100).toFixed(1) },
      { name: 'Negative', value: negative, percentage: ((negative/total) * 100).toFixed(1) },
      { name: 'Neutral', value: neutral, percentage: ((neutral/total) * 100).toFixed(1) }
    ];

    // Get top 5 keywords with sentiment distribution
    const topKeywordsWithSentiments = Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => {
        const sentiments = keywordSentiments.get(name);
        return {
          name,
          value,
          sentiments: {
            positive: sentiments.positive,
            negative: sentiments.negative,
            neutral: sentiments.neutral
          }
        };
      });

    const response = {
      pieData,
      keywordSentiments: topKeywordsWithSentiments,
      totalReviews: reviews.length
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error.message },
      { status: 500 }
    );
  }
}
