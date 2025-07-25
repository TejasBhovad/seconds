"use server";

import connectMongo from "@/lib/mongodb";
import Count from "@/models/Count";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

async function createCount(countData) {
  try {
    await connectMongo();

    const existingCount = await Count.findOne({ slug: countData.slug }).lean();
    if (existingCount) {
      throw new Error(`Count with slug "${countData.slug}" already exists`);
    }

    const creator = await User.findById(countData.creator);
    if (!creator) {
      throw new Error("Creator not found");
    }

    const count = new Count({
      name: countData.name,
      category: countData.category,
      date: countData.date || new Date(),
      theme: countData.theme || "default",
      colors: {
        primary: countData.colors?.primary || "#000000",
        muted: countData.colors?.muted || "#FFFFFF",
        inverted: countData.colors?.inverted || "#000000",
        background: countData.colors?.background || "#F0F0F0",
      },
      image: countData.image || "",
      slug: countData.slug,
      rsvpLink: countData.rsvpLink || "",
      emails: [],
      creator: countData.creator,
    });

    await count.save();
    console.log("Count created successfully:", countData.slug);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return JSON.parse(JSON.stringify(count));
  } catch (error) {
    console.error("Error creating count:", error);
    throw error;
  }
}

async function getUserCounts(userId) {
  try {
    await connectMongo();

    const counts = await Count.find({ creator: userId })
      .populate("creator", "name email image")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(counts));
  } catch (error) {
    console.error("Error fetching user counts:", error);
    throw error;
  }
}

async function getAllCounts(limit = 20, skip = 0) {
  try {
    await connectMongo();

    const counts = await Count.find({})
      .populate("creator", "name image slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return JSON.parse(JSON.stringify(counts));
  } catch (error) {
    console.error("Error fetching all counts:", error);
    throw error;
  }
}

async function getCountBySlug(slug) {
  try {
    await connectMongo();

    const count = await Count.findOne({ slug })
      .populate("creator", "name email image slug")
      .lean();

    if (!count) {
      throw new Error("Count not found");
    }

    return JSON.parse(JSON.stringify(count));
  } catch (error) {
    console.error("Error fetching count:", error);
    throw error;
  }
}

async function updateCount(countId, updateData, userId) {
  try {
    await connectMongo();

    const existingCount = await Count.findById(countId);
    if (!existingCount) {
      throw new Error("Count not found");
    }

    if (existingCount.creator.toString() !== userId) {
      throw new Error("Unauthorized: You can only update your own counts");
    }

    if (updateData.slug && updateData.slug !== existingCount.slug) {
      const slugExists = await Count.findOne({
        slug: updateData.slug,
        _id: { $ne: countId },
      });
      if (slugExists) {
        throw new Error(`Count with slug "${updateData.slug}" already exists`);
      }
    }

    const updatedCount = await Count.findByIdAndUpdate(
      countId,
      {
        ...updateData,
        ...(updateData.colors && {
          colors: {
            ...existingCount.colors.toObject(),
            ...updateData.colors,
          },
        }),
      },
      { new: true, runValidators: true },
    ).populate("creator", "name email image");

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/count/${updatedCount.slug}`);

    return JSON.parse(JSON.stringify(updatedCount));
  } catch (error) {
    console.error("Error updating count:", error);
    throw error;
  }
}

async function deleteCount(countId, userId) {
  try {
    await connectMongo();

    const count = await Count.findById(countId);
    if (!count) {
      throw new Error("Count not found");
    }

    if (count.creator.toString() !== userId) {
      throw new Error("Unauthorized: You can only delete your own counts");
    }

    await Count.findByIdAndDelete(countId);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Count deleted successfully" };
  } catch (error) {
    console.error("Error deleting count:", error);
    throw error;
  }
}

async function rsvpToCount(countSlug, email) {
  try {
    await connectMongo();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const count = await Count.findOne({ slug: countSlug });
    if (!count) {
      throw new Error("Count not found");
    }

    if (count.emails.includes(email.toLowerCase())) {
      throw new Error("Email already RSVP'd to this event");
    }

    count.emails.push(email.toLowerCase());
    await count.save();

    revalidatePath(`/count/${countSlug}`);

    return {
      success: true,
      message: "RSVP successful",
      rsvpCount: count.emails.length,
    };
  } catch (error) {
    console.error("Error adding RSVP:", error);
    throw error;
  }
}

async function removeRsvpFromCount(countSlug, email) {
  try {
    await connectMongo();

    const count = await Count.findOne({ slug: countSlug });
    if (!count) {
      throw new Error("Count not found");
    }

    const emailIndex = count.emails.indexOf(email.toLowerCase());
    if (emailIndex === -1) {
      throw new Error("Email not found in RSVP list");
    }

    count.emails.splice(emailIndex, 1);
    await count.save();

    revalidatePath(`/count/${countSlug}`);

    return {
      success: true,
      message: "RSVP removed successfully",
      rsvpCount: count.emails.length,
    };
  } catch (error) {
    console.error("Error removing RSVP:", error);
    throw error;
  }
}

async function getRsvpCount(countSlug) {
  try {
    await connectMongo();

    const count = await Count.findOne({ slug: countSlug }, "emails").lean();
    if (!count) {
      throw new Error("Count not found");
    }

    return {
      count: count.emails.length,
      emails: count.emails,
    };
  } catch (error) {
    console.error("Error fetching RSVP count:", error);
    throw error;
  }
}

async function checkRsvpStatus(countSlug, email) {
  try {
    await connectMongo();

    const count = await Count.findOne({ slug: countSlug }, "emails").lean();
    if (!count) {
      throw new Error("Count not found");
    }

    const hasRsvpd = count.emails.includes(email.toLowerCase());

    return {
      hasRsvpd,
      totalRsvps: count.emails.length,
    };
  } catch (error) {
    console.error("Error checking RSVP status:", error);
    throw error;
  }
}

async function generateUniqueSlug(baseSlug) {
  try {
    await connectMongo();

    let slug = baseSlug.toLowerCase().trim();
    let counter = 1;

    while (await Count.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  } catch (error) {
    console.error("Error generating unique slug:", error);
    throw error;
  }
}

async function getCountsByCategory(category, limit = 20, skip = 0) {
  try {
    await connectMongo();

    const counts = await Count.find({ category })
      .populate("creator", "name image slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    return JSON.parse(JSON.stringify(counts));
  } catch (error) {
    console.error("Error fetching counts by category:", error);
    throw error;
  }
}

export {
  createCount,
  getCountsByCategory,
  getUserCounts,
  getAllCounts,
  getCountBySlug,
  updateCount,
  deleteCount,
  rsvpToCount,
  removeRsvpFromCount,
  getRsvpCount,
  checkRsvpStatus,
  generateUniqueSlug,
};
