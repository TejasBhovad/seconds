"use server";
import connectMongo from "@/lib/mongodb";
import Count from "@/models/Count";


async function createCount(countData) {
    try {
        await connectMongo();
    
        // Check if count already exists to prevent duplicates
        const existingCount = await Count.findOne({ slug: countData.slug }).lean();
        if (existingCount) {
            console.log("Count Exists:", countData.slug);
            return existingCount;
        }
        // Create a new count
        const count = new Count({
            name: countData.name,
            date: countData.date || new Date(),
            image: countData.image || "",
            slug: countData.slug || "",
            time: {
                hours: countData.time.hours || 0,
                minutes: countData.time.minutes || 0,
                seconds: countData.time.seconds || 0
            }
        });

        await count.save();
        console.log("Count created successfully:", countData.slug);
        return count.toObject();
    } catch (error) {
        console.error("Error creating count:", error);
        throw error;
    }
}

export { createCount };
