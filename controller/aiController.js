require("dotenv").config();
const OpenAI = require('openai')
const axios = require('axios')
const cloudinary = require('../cloudinary/cloudinary')
const FormData = require("form-data");





const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});



// finish 
exports.generateArticle = async (req, res) => {
  console.log("Inside generateArticle ");
  
  const client = new OpenAI();
  try {
    const { prompt, length = 500 } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: `Write a meaningful and well-structured article about "${prompt}".
The article should be approximately ${length} words.
Use simple language and keep the content clear and informative.`


    });
      console.log(response.output_text);
  res.status(200).json(response.output_text)
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(error.status || 500).json({
      error: "AI request failed",
      message: error.message
    });
  }
};

exports.generateBlogTitle = async (req, res) => {
  console.log("Inside generateBlogTitle ");
  
  const client = new OpenAI();
  try {
    const { prompt, category = 500 } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: `Generate  SEO-friendly and meaningful blog titles using the prompt "${prompt}" 
for the category "${category}". Titles should be easy to understand and relevant to the topic.`


    });
      console.log(response.output_text);
  res.status(200).json(response.output_text)
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(error.status || 500).json({
      error: "AI request failed",
      message: error.message
    });
  }
};

exports.generateImage = async (req, res) => {
  console.log("inside generate image controller");

  const { prompt } = req.body
  if (!prompt) {
    res.status(401).json("please sent me prompt")
  }
  else {
    try {
      const formData = new FormData()
      formData.append('prompt', prompt)

      const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
        headers: { 'x-api-key': process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer"
      })
      const base64Image = Buffer.from(data).toString("base64");
      const image = `data:image/png;base64,${base64Image}`

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
  const image = req.file
  if (!req.file) {
    res.status(401).json("please upload an  image")
  }
  else {
    try {
      const upload = await cloudinary.uploader.upload(image.path, {
        transformation: [
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

//not  working 






// exports.removeBAckgroundObject = async (req, res) => {
//   console.log("inside removeBAckgroundObject");

//   console.log(req.file);
//   const image = req.file
//   const {description} = req.body
//   console.log(description);

//   if (!req.file) {
//     res.status(401).json("please upload an  image")
//   }
//   else {
//     try {
//       const upload = await cloudinary.uploader.upload(image.path, {
//             effect: "gen_remove",
//             prompt :description 
//       })
//       console.log(upload);

//       // console.log(data);
//       res.status(200).json(upload.secure_url)


//     } catch (error) {
//       res.status(500).json(error)
//       console.log(error);

//     }
//   }
// }

exports.removeBackgroundObject = async (req, res) => {
  if (!req.file) {
    return res.status(400).json("Please upload an image");
  }

  const prompt = String(req.body.prompt || "").trim();

  if (!prompt) {
    return res.status(400).json("Prompt is required");
  }

  try {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      background_removal: {
        prompt: prompt // This keeps the dog, removes background
      }
    });

    res.status(200).json({
      imageUrl: upload.secure_url
    });

  } catch (error) {
    console.error("Cloudinary error:", error);
    res.status(500).json(error.message);
  }
};


// text ai working 

exports.testingAi = async (req, res) => {
  console.log("inside testing api");

  const client = new OpenAI();

  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: `Explain how Artificial Intelligence works in simple terms with 1 word`

  });

  console.log(response.output_text);
  res.status(200).json(response.output_text)
}

// exports.testingAi = async (req, res) => {
//   console.log("inside testing api");

//   try {
//     const client = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY
//     });

//     const response = await client.responses.create({
//       model: "gpt-5-nano",
//       input: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "input_text",
//               text: "Explain how Artificial Intelligence works in simple terms"
//             }
//           ]
//         }
//       ],
//       max_output_tokens: 300
//     });

//     // Safe extraction
//     const text =
//       response.output?.[0]?.content?.[0]?.text || "No response";

//     console.log(text);
//     res.status(200).json(text);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

