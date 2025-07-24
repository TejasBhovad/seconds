"use server";

import connectMongo from "@/lib/mongoose";
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

export async function createUser(userData) {
  await connectMongo();

  if (!userData.slug || userData.slug.trim() === "") {
    userData.slug = await generateUniqueSlug(userData.name);
  }

  const user = new User(userData);
  await user.save();
  return user.toObject();
}
