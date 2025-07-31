export const CATEGORY_OPTIONS = [
  // Appetizers & Starters
  { name: "Appetizers", emoji: "🥨", description: "Light bites and starters" },
  { name: "Starters", emoji: "🥖", description: "Begin your meal with these" },
  { name: "Soups", emoji: "🍲", description: "Warm and comforting soups" },
  { name: "Salads", emoji: "🥗", description: "Fresh and healthy salads" },
  
  // Main Courses
  { name: "Main Courses", emoji: "🍽️", description: "Our signature main dishes" },
  { name: "Pasta", emoji: "🍝", description: "Delicious pasta dishes" },
  { name: "Pizza", emoji: "🍕", description: "Fresh baked pizzas" },
  { name: "Burgers", emoji: "🍔", description: "Juicy burgers and sandwiches" },
  { name: "Seafood", emoji: "🐟", description: "Fresh seafood dishes" },
  { name: "Steaks", emoji: "🥩", description: "Premium cuts of meat" },
  { name: "Chicken", emoji: "🍗", description: "Poultry dishes" },
  { name: "Vegetarian", emoji: "🥬", description: "Plant-based options" },
  { name: "Vegan", emoji: "🌱", description: "100% plant-based dishes" },
  
  // Sides & Accompaniments
  { name: "Sides", emoji: "🥔", description: "Perfect accompaniments" },
  { name: "Breads", emoji: "🥖", description: "Fresh baked breads" },
  { name: "Rice Dishes", emoji: "🍚", description: "Rice-based dishes" },
  
  // Desserts
  { name: "Desserts", emoji: "🍰", description: "Sweet endings to your meal" },
  { name: "Ice Cream", emoji: "🍨", description: "Cold and creamy treats" },
  { name: "Cakes", emoji: "🎂", description: "Delicious cakes and pastries" },
  
  // Beverages
  { name: "Beverages", emoji: "🥤", description: "Refreshing drinks" },
  { name: "Coffee", emoji: "☕", description: "Hot and cold coffee" },
  { name: "Tea", emoji: "🫖", description: "Various tea selections" },
  { name: "Juices", emoji: "🧃", description: "Fresh fruit juices" },
  { name: "Smoothies", emoji: "🥤", description: "Healthy smoothies" },
  { name: "Alcoholic Drinks", emoji: "🍷", description: "Wine, beer, and cocktails" },
  
  // Special Categories
  { name: "Kids Menu", emoji: "👶", description: "Specially for little ones" },
  { name: "Chef's Specials", emoji: "👨‍🍳", description: "Chef's daily recommendations" },
  { name: "Seasonal", emoji: "🍂", description: "Seasonal specialties" },
  { name: "Gluten Free", emoji: "🌾", description: "Gluten-free options" },
  { name: "Spicy", emoji: "🌶️", description: "Hot and spicy dishes" },
  { name: "Healthy", emoji: "💚", description: "Nutritious and healthy choices" },
  { name: "Breakfast", emoji: "🍳", description: "Morning favorites" },
  { name: "Lunch", emoji: "🥪", description: "Perfect lunch options" },
  { name: "Dinner", emoji: "🍽️", description: "Evening dining selections" },
  { name: "Late Night", emoji: "🌙", description: "Late night cravings" },
];

export const getCategoryByEmoji = (emoji: string) => {
  return CATEGORY_OPTIONS.find(cat => cat.emoji === emoji);
};

export const getCategoryByName = (name: string) => {
  return CATEGORY_OPTIONS.find(cat => cat.name === name);
}; 