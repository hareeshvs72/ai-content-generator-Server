require("dotenv").config();
const OpenAI = require("openai")
const axios = require('axios')
const cloudinary =  require('../cloudinary/cloudinary')
const FormData = require("form-data");
const Ai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
});

// not working

exports.generateArticle = async (req, res) => {
  try {
    const { prompt, length } = req.body;

    const response = await Ai.chat.completions.create({
      model: "gemini-1.5-flash", // ✅ stable & higher quota
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: Math.min(length || 500, 600), // keep low
    });

    res.status(200).json({
      article: response.choices[0].message.content
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        fix: "Wait 30–60 seconds or reduce requests / tokens"
      });
    }

    res.status(500).json({
      error: "AI request failed",
      details: error.message
    });
  }
};


// working done

exports.generateImage = async (req, res) => {
  console.log("inside generate image controller");

  const { prompt } = req.body
  if(!prompt){
  res.status(401).json("please sent me prompt")
  }
  else{
  try {
    const formData = new FormData()
    formData.append('prompt', prompt)

    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
      headers: { 'x-api-key': process.env.CLIPDROP_API_KEY },
      responseType: "arraybuffer"
    })
    const base64Image = Buffer.from(data).toString("base64");
    const image  = `data:image/png;base64,${base64Image}`

    const upload = await cloudinary.uploader.upload(image)
    // console.log(upload);
  
    // console.log(data);
    res.status(200).json(upload.secure_url)


  } catch (error) {
    res.status(500).json(error)
    console.log(error);

  }
  }
}


exports.removeImageBackground = async (req, res) => {
  console.log("inside removeImageBackground");

  console.log(req.file);
  const image  = req.file
  if(!req.file){
  res.status(401).json("please upload an  image")
  }
  else{
  try {
    const upload = await cloudinary.uploader.upload(image.path,{
      transformation:[
        {
            effect: "background_removal",
            // background_removal:"remove_the_background"
        }
      ]
    })
    console.log(upload);
  
    // console.log(data);
    res.status(200).json(upload.secure_url)


  } catch (error) {
    res.status(500).json(error)
    console.log(error);

  }
  }
}