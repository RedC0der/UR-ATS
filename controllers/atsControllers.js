const Result = require('../models/Result');
const pdfParse = require('pdf-parse');

const checkATS = async (req, res) => {
  try {
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({ 
        error: 'Please provide both a PDF file and job description' 
      });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text.toLowerCase();
    const jobDescription = req.body.jobDescription.toLowerCase();

    // Extract keywords from job description
    // Remove common words and split into unique keywords
    const commonWords = new Set(['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const keywords = [...new Set(
      jobDescription
        .split(/[\s,\.]+/)
        .filter(word => word.length > 2 && !commonWords.has(word))
    )];

    // Check each keyword
    const keywordResults = keywords.map(word => ({
      word,
      found: resumeText.includes(word)
    }));

    // Calculate score
    const matchedKeywords = keywordResults.filter(k => k.found).length;
    const score = Math.round((matchedKeywords / keywords.length) * 100);

    // Save result to database
    const result = new Result({
      jobDescription: req.body.jobDescription,
      resumeText: resumeText,
      score,
      keywords: keywordResults
    });
    await result.save();

    // Send response
    res.json({
      score,
      keywordMatches: keywordResults,
      totalKeywords: keywords.length,
      matchedKeywords
    });

  } catch (error) {
    console.error('Error in checkATS:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
};

module.exports = {
  checkATS
};