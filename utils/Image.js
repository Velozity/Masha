const tf = require("@tensorflow/tfjs-node");
const axios = require("axios");
const coco_ssd = require("@tensorflow-models/coco-ssd");
const mobilenet = require("@tensorflow-models/mobilenet");
async function loadImageAndResize(imageUrl) {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const tensor = tf.node.decodeImage(response.data, 3); // Add the optional second parameter to specify the number of channels

  return tensor;
}

let model;
(async () => {
  model = await mobilenet.load({ version: 2, alpha: 1.0 });
  console.log("Image Model Ready");
})();
async function predictExternalImage(imageUrl) {
  if (!model) return "unknown";

  const tensor = await loadImageAndResize(imageUrl);

  const predictions = await model.classify(tensor);
  console.log(predictions);
  if (predictions.length > 0) {
    const highestPrediction = predictions.sort(
      (a, b) => b.probability - a.probability
    )[0];

    if (highestPrediction.probability < 0.22) return "unknown";

    return highestPrediction.className;
  }

  return "unknown";
}

module.exports = {
  predictExternalImage,
};
