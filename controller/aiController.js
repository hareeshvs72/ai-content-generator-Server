require("dotenv").config();
const OpenAI = require('openai')
const axios = require('axios')
const cloudinary = require('../cloudinary/cloudinary')
const FormData = require("form-data");
const aiDatas = require("../Model/aiSchema");





const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});



// finish 
exports.generateArticle = async (req, res) => {
  console.log("Inside generateArticle ");

  const client = new OpenAI();
  try {
    const email= req.payload
    console.log(req.payload);
    
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
    if(response.output_text){
   
    
    }
    // res.status(200).json(response.output_text)
     const  newArticle =  new aiDatas({
      userId:email,prompt,output:response.output_text,ai:"article"
      
    })
        await newArticle.save()

    res.status(200).json(newArticle)
  } catch (err) {
    console.error("AI ERROR:", err);
        
    res.status(err.status || 500).json({
      error: "AI request failed",
      message: err.message
    });
  }
};

exports.generateBlogTitle = async (req, res) => {
  console.log("Inside generateBlogTitle ");
  const email = req.payload
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
     const  newBlogTitle =  new aiDatas({
      userId:email,prompt,category,output:response.output_text,ai:"blogTitle"
      
    })
        await newBlogTitle.save()
    res.status(200).json(newBlogTitle)
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
 const email = req.payload
  const { prompt, style } = req.body
  if (!prompt) {
    res.status(401).json("please sent me prompt")
  }
  else {
    try {
      const styleText = style || "";

      const finalPrompt = `${prompt}, ${styleText}`;
      const formData = new FormData()
      formData.append('prompt', finalPrompt)

      const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
        headers: { 'x-api-key': process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer"
      })
      const base64Image = Buffer.from(data).toString("base64");
      const image = `data:image/png;base64,${base64Image}`

      const upload = await cloudinary.uploader.upload(image)
      // console.log(upload);

      // console.log(data);
      const  newImage =  new aiDatas({
      userId:email,prompt,category:style,output:upload.secure_url,ai:"imagegenerator"
      
    })
        await newImage.save()
    res.status(200).json(newImage)
      res.status(200).json(newImage)


    } catch (error) {
      res.status(500).json(error)
      console.log(error);

    }
  }
}

exports.removeImageBackground = async (req, res) => {
  console.log("inside removeImageBackground");
  const email =  req.payload
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
      const  newBgRemove =  new aiDatas({
      userId:email,prompt:"removebg",category:"removebg",output:upload.secure_url,ai:"bgRemove"
      
    })
        await newBgRemove.save()
      // console.log(data);
      res.status(200).json(newBgRemove)


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

// ------------------------  get delet api call ----------

exports.getUserAIDataController = async (req, res) => {
  console.log("inside getUserAiDataController");
  
  try {
    const email = req.payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // 🔥 pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    // ✅ get paginated data
    const aiData = await aiDatas
      .find({ userId: email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ✅ total count (important)
    const total = await aiDatas.countDocuments({ userId: email });

    // ✅ counts (for dashboard cards 🔥)
    const articlecount = await aiDatas.countDocuments({ userId: email,ai: "article" });
    const blogTitlecount = await aiDatas.countDocuments({ userId: email,ai: "blogTitle" });
    const imagegeneratedCount = await aiDatas.countDocuments({ userId: email,ai:"imagegenerator" });
    const bgremoveCount = await aiDatas.countDocuments({ userId: email, ai:"bgRemove"});
 console.log(imagegeneratedCount);
 
    res.status(200).json({
      success: true,
      data: aiData,
      total,
      page,
      pages: Math.ceil(total / limit),

      // 🔥 send counts separately (BEST PRACTICE)
      counts: {
        articlecount,
        blogTitlecount,
        imagegeneratedCount,
        bgremoveCount,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};