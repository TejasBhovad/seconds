"use server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function generateUniqueSlug(name) {
  let slug = slugify(name);
  let slugExists = await User.findOne({ slug }).lean();
  let suffix = 1;

  while (slugExists) {
    const newSlug = `${slug}-${suffix}`;
    slugExists = await User.findOne({ slug: newSlug }).lean();
    if (!slugExists) {
      slug = newSlug;
      break;
    }
    suffix++;
  }

  return slug;
}

// Helper function to serialize MongoDB objects to plain objects
function serializeUser(user) {
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image || "",
    slug: user.slug,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
  };
}

export async function createUser(userData) {
  try {
    await connectMongo();

    // Check if user already exists to prevent duplicates
    const existingUser = await User.findOne({ email: userData.email }).lean();
    if (existingUser) {
      console.log("User already exists:", userData.email);
      return serializeUser(existingUser);
    }

    // Generate slug if not provided or empty
    if (!userData.slug || userData.slug.trim() === "") {
      userData.slug = await generateUniqueSlug(userData.name);
    }

    const user = new User({
      name: userData.name,
      email: userData.email,
      image: userData.image || "",
      slug: userData.slug,
    });

    const savedUser = await user.save();
    console.log("User created successfully:", userData.email);
    return serializeUser(savedUser.toObject());
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function getUserByEmail(email) {
  try {
    await connectMongo();
    const user = await User.findOne({ email }).lean();
    return serializeUser(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function getUserBySlug(slug) {
  try {
    await connectMongo();
    const user = await User.findOne({ slug }).lean();
    return serializeUser(user);
  } catch (error) {
    console.error("Error fetching user by slug:", error);
    throw new Error("Failed to fetch user");
  }
}
