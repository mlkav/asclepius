const { Firestore } = require('@google-cloud/firestore');

const isGCP = Boolean(process.env.K_SERVICE || process.env.GOOGLE_APPLICATION_CREDENTIALS);

const db = new Firestore({
  projectId: process.env.GCP_PROJECT_ID || 'submissionmlgc-rnlkav',
});

const localHistories = [];

async function storePrediction(data) {
  // unshift
  localHistories.unshift({
    id: data.id,
    history: data,
  });

  if (isGCP) {
    try {
      const predictCollection = db.collection('predictions');
      await predictCollection.doc(data.id).set(data);
    } catch (dbErr) {
      console.warn('Firestore Warning:', dbErr.message);
    }
  }
}

async function getPredictionHistories() {
  if (!isGCP) {
    return localHistories;
  }

  try {
    const predictCollection = db.collection('predictions');
    // Sort by createdAt DESC
    const snapshot = await predictCollection.orderBy('createdAt', 'desc').get();

    const histories = [];
    snapshot.forEach((doc) => {
      histories.push({
        id: doc.id,
        history: doc.data(),
      });
    });

    return histories;
  } catch (error) {
    console.warn('Histories Error (Fallback ke lokal):', error.message);
    return localHistories;
  }
}

module.exports = { storePrediction, getPredictionHistories };
