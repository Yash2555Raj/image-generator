// const key = "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"; // Replace with your valid Hugging Face API key
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const genBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const reset = document.getElementById("Reset");
const downloadBtn = document.getElementById("Download");

async function query(data) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: data }),
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.blob();
        return result;
    } catch (error) {
        console.error("Error in query:", error);
        alert("Failed to generate image. Please check your API key or try again later.");
        return null;
    }
}

async function generate() {
    const prompt = inputText.value.trim();
    if (!prompt) {
        alert("Please enter a text prompt.");
        return;
    }

    // Show loading spinner, hide default SVG and previous image
    load.style.display = "block";
    svg.style.display = "none";
    image.style.display = "none";

    const response = await query(prompt);
    if (response) {
        const objectUrl = URL.createObjectURL(response);
        image.src = objectUrl;
        image.style.display = "block"; // Show the generated image
        load.style.display = "none"; // Hide loading spinner

        // Update download button href
        downloadBtn.onclick = () => download(objectUrl);
    } else {
        load.style.display = "none";
        svg.style.display = "block"; // Show default SVG on error
    }
}

function download(objectUrl) {
    fetch(objectUrl)
        .then((res) => res.blob())
        .then((file) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = `image_${new Date().getTime()}.png`;
            a.click();
            URL.revokeObjectURL(a.href); // Clean up
        })
        .catch(() => alert("Failed to download image."));
}

function resetForm() {
    inputText.value = "";
    image.src = "";
    image.style.display = "none";
    svg.style.display = "block";
    load.style.display = "none";
    downloadBtn.onclick = null; // Clear download action
}

// Event Listeners
genBtn.addEventListener("click", generate);

inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generate();
    }
});

reset.addEventListener("click", resetForm);