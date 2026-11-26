import type { ImageMetadata } from "astro";

export type Project = {
  slug: string;
  title: string;
  category: string;
  image: ImageMetadata;
  alt: string;
};

const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/work/*/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

const categories: Record<string, string> = {
  branding: "Branding", mockup: "Mockup", flyer: "Flyer", event: "Event",
};

// Use this for names that need an apostrophe or special spelling
const names: Record<string, string> = {
  "teejays-drip": "Teejay's Drip",
  "teejays-couture": "The Teejay's Couture",
  "pearls-bakes": "Pearl's Bakes",
  "nielas-perfect-fit": "Niella's Perfect Fit",
};

export const projects: Project[] = Object.entries(files).map(([path, mod]) => {
  const [, folder, file] = path.match(/work\/([^/]+)\/([^/]+)\.\w+$/)!;
  const title =
    names[file] ?? file.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    slug: file,
    title,
    category: categories[folder] ?? folder,
    image: mod.default,
    alt: title,
  };
});