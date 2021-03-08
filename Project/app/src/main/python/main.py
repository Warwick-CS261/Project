from nltk.sentiment import SentimentIntensityAnalyzer
import sys

sia = SentimentIntensityAnalyzer()
results = sia.polarity_scores(sys.argv[1])
print(results['compound'])
