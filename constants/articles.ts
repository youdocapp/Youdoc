export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  featured?: boolean;
  content: string;
  publishedDate: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: '5 Ways to Manage Stress Daily',
    description: 'Learn effective techniques to manage daily stress and improve your mental wellbeing.',
    category: 'Mental Health',
    author: 'Dr. Sarah Chen',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    featured: true,
    publishedDate: 'January 15, 2024',
    content: 'Stress is an inevitable part of modern life, but managing it effectively can significantly improve your overall wellbeing. Here are five evidence-based strategies to help you manage stress on a daily basis.\n\n1. Practice Mindfulness Meditation\nTaking just 10 minutes each day to practice mindfulness can reduce stress hormones and improve your ability to handle challenging situations. Focus on your breath and observe your thoughts without judgment.\n\n2. Regular Physical Exercise\nExercise releases endorphins, which are natural mood elevators. Aim for at least 30 minutes of moderate activity most days of the week.\n\n3. Maintain a Consistent Sleep Schedule\nQuality sleep is crucial for stress management. Try to go to bed and wake up at the same time each day, even on weekends.\n\n4. Connect with Others\nSocial support is a powerful stress buffer. Make time to connect with friends and family regularly.\n\n5. Set Boundaries\nLearn to say no to commitments that will overextend you. Protecting your time and energy is essential for managing stress.'
  },
  {
    id: '2',
    title: 'Understanding Heart Health',
    description: 'Essential information about maintaining a healthy heart and preventing cardiovascular disease.',
    category: 'Lifestyle',
    author: 'Dr. Michael Johnson',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    publishedDate: 'January 12, 2024',
    content: 'Your heart is one of the most vital organs in your body, and taking care of it should be a top priority. Understanding the basics of heart health can help you make informed decisions about your lifestyle and medical care.\n\nThe heart pumps blood throughout your body, delivering oxygen and nutrients to your tissues and removing waste products. Maintaining cardiovascular health involves several key factors including diet, exercise, stress management, and regular medical checkups.\n\nKey factors for heart health include maintaining a healthy weight, eating a balanced diet rich in fruits and vegetables, exercising regularly, managing stress, avoiding smoking, and limiting alcohol consumption.'
  },
  {
    id: '3',
    title: 'Nutrition Basics for Beginners',
    description: 'A comprehensive guide to understanding macronutrients and building a balanced diet.',
    category: 'Nutrition',
    author: 'Dr. Emily Rodriguez',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    publishedDate: 'January 10, 2024',
    content: 'Understanding nutrition doesn\'t have to be complicated. This guide will help you understand the basics of macronutrients and how to build a balanced diet that supports your health goals.\n\nMacronutrients are the nutrients your body needs in large amounts: carbohydrates, proteins, and fats. Each plays a unique and important role in your body.\n\nCarbohydrates are your body\'s primary energy source. Focus on complex carbs like whole grains, fruits, and vegetables rather than simple sugars.\n\nProteins are essential for building and repairing tissues. Include a variety of protein sources in your diet, including lean meats, fish, legumes, and dairy.\n\nHealthy fats are crucial for hormone production and nutrient absorption. Include sources like avocados, nuts, seeds, and olive oil in your diet.'
  },
  {
    id: '4',
    title: '10 Healthy Habits to Start Today',
    description: 'Discover simple yet significant lifestyle changes for better health.',
    category: 'Lifestyle',
    author: 'Dr. James Wilson',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    publishedDate: 'January 8, 2024',
    content: 'Building healthy habits doesn\'t have to be overwhelming. Start with these 10 simple changes that can make a significant impact on your overall health and wellbeing.\n\n1. Drink more water throughout the day\n2. Take regular breaks from sitting\n3. Practice gratitude daily\n4. Eat more whole foods\n5. Get adequate sleep\n6. Move your body regularly\n7. Limit screen time before bed\n8. Practice deep breathing\n9. Connect with loved ones\n10. Spend time in nature\n\nRemember, consistency is key. Start with one or two habits and gradually add more as they become part of your routine.'
  },
  {
    id: '5',
    title: 'The Benefits of Regular Exercise',
    description: 'How consistent physical activity can transform your health and wellbeing.',
    category: 'Fitness',
    author: 'Dr. Lisa Anderson',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    publishedDate: 'January 5, 2024',
    content: 'Regular exercise is one of the most powerful tools for improving your physical and mental health. The benefits extend far beyond weight management and include improved mood, better sleep, increased energy, and reduced risk of chronic diseases.\n\nPhysical benefits include stronger muscles and bones, improved cardiovascular health, better balance and coordination, and enhanced immune function.\n\nMental benefits include reduced anxiety and depression, improved mood and self-esteem, better cognitive function, and stress relief.\n\nAim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous-intensity activity per week, along with muscle-strengthening activities on two or more days per week.'
  },
  {
    id: '6',
    title: 'Sleep Hygiene: Better Rest Tonight',
    description: 'Practical tips for improving your sleep quality and establishing healthy sleep patterns.',
    category: 'Mental Health',
    author: 'Dr. Robert Taylor',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    publishedDate: 'January 3, 2024',
    content: 'Quality sleep is essential for physical health, mental wellbeing, and overall quality of life. Sleep hygiene refers to the habits and practices that promote consistent, uninterrupted sleep.\n\nKey sleep hygiene practices include maintaining a consistent sleep schedule, creating a relaxing bedtime routine, optimizing your sleep environment, limiting caffeine and alcohol, avoiding large meals before bed, and managing stress.\n\nYour bedroom should be cool, dark, and quiet. Consider using blackout curtains, earplugs, or a white noise machine if needed. Keep electronic devices out of the bedroom or at least turn them off an hour before bed.'
  },
  {
    id: '7',
    title: 'Meal Prep Made Simple',
    description: 'Time-saving strategies for preparing healthy meals throughout the week.',
    category: 'Nutrition',
    author: 'Dr. Amanda Lee',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
    publishedDate: 'January 1, 2024',
    content: 'Meal prepping is a game-changer for maintaining a healthy diet while managing a busy schedule. By dedicating a few hours each week to meal preparation, you can ensure you always have nutritious meals ready to go.\n\nStart by planning your meals for the week. Choose recipes that use similar ingredients to minimize waste and shopping time. Make a detailed grocery list and stick to it.\n\nBatch cooking is your friend. Cook large portions of grains, proteins, and vegetables that can be mixed and matched throughout the week. Invest in quality storage containers to keep your meals fresh.\n\nDon\'t forget about snacks! Prep healthy snacks like cut vegetables, fruit, nuts, and yogurt to avoid reaching for less nutritious options when hunger strikes.'
  },
  {
    id: '8',
    title: 'Yoga for Beginners',
    description: 'Start your yoga journey with these foundational poses and breathing techniques.',
    category: 'Fitness',
    author: 'Dr. Sarah Chen',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    publishedDate: 'December 28, 2023',
    content: 'Yoga is an ancient practice that combines physical postures, breathing techniques, and meditation to promote overall health and wellbeing. It\'s accessible to people of all fitness levels and can be adapted to meet individual needs.\n\nBegin with basic poses like Mountain Pose, Downward-Facing Dog, Child\'s Pose, and Warrior I. Focus on proper alignment and breathing rather than achieving perfect poses.\n\nBreathing is a fundamental aspect of yoga. Practice deep, controlled breathing through your nose, coordinating your breath with your movements.\n\nStart with short sessions of 10-15 minutes and gradually increase as you become more comfortable. Remember, yoga is a personal practice - honor your body and don\'t push beyond your limits.'
  }
];

export const categories = [
  { name: 'All Articles', count: articles.length },
  { name: 'Nutrition', count: articles.filter(a => a.category === 'Nutrition').length },
  { name: 'Fitness', count: articles.filter(a => a.category === 'Fitness').length },
  { name: 'Mental Health', count: articles.filter(a => a.category === 'Mental Health').length },
  { name: 'Lifestyle', count: articles.filter(a => a.category === 'Lifestyle').length }
];
