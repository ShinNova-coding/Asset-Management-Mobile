import { Asset } from "@/types/asset";

export const mockAssets: Asset[] = [
  {
    id: 1,
    name: "MacBook Pro 16",
    category: "Laptop",
    status: "Assigned",
    condition: "Excellent",
    image:
      "https://picsum.photos/200",
  },

  {
    id: 2,
    name: "Dell UltraSharp 27",
    category: "Display",
    status: "Assigned",
    condition: "Good",
    image:
      "https://picsum.photos/201",
  },

  {
    id: 3,
    name: "iPhone 15 Pro",
    category: "Mobile",
    status: "Repair",
    condition: "Damaged Screen",
    image:
      "https://picsum.photos/202",
  },
];