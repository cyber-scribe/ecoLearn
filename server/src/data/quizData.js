const quizData = [
  {
    title: 'Recycling Basics',
    category: 'Recycling',
    difficulty: 'easy',
    timeLimit: 10,
    questions: [
      {
        question: 'Which bin should clean glass bottles go into?',
        options: ['Compost bin', 'Recycling bin', 'General waste after rinsing', 'Garden waste'],
        correctAnswer: 1,
        explanation: 'Glass bottles should be placed in the recycling bin after rinsing them clean.',
        points: 10
      },
      {
        question: 'How long does it take for a plastic bottle to decompose?',
        options: ['50 years', '100 years', '450 years', '1000 years'],
        correctAnswer: 2,
        explanation: 'Plastic bottles take approximately 450 years to decompose in landfills.',
        points: 10
      },
      {
        question: 'What does the recycling symbol with three arrows represent?',
        options: ['Reduce, Reuse, Recycle', 'Made from recycled materials', 'Recyclable material', 'Biodegradable'],
        correctAnswer: 0,
        explanation: 'The three arrows represent the recycling loop: Reduce, Reuse, and Recycle.',
        points: 10
      },
      {
        question: 'Which of these items should NOT be put in regular recycling?',
        options: ['Aluminum cans', 'Pizza boxes with grease', 'Plastic water bottles', 'Newspapers'],
        correctAnswer: 1,
        explanation: 'Greasy pizza boxes contaminate the recycling process and should be composted or disposed of in general waste.',
        points: 10
      },
      {
        question: 'What percentage of waste can be recycled?',
        options: ['25%', '50%', '75%', '90%'],
        correctAnswer: 2,
        explanation: 'Up to 75% of waste can be recycled, but currently only about 30% is actually recycled.',
        points: 10
      }
    ]
  },
  {
    title: 'Energy Conservation',
    category: 'Energy',
    difficulty: 'medium',
    timeLimit: 15,
    questions: [
      {
        question: 'What is the most energy-efficient lighting option?',
        options: ['Incandescent bulbs', 'LED bulbs', 'CFL bulbs', 'Halogen bulbs'],
        correctAnswer: 1,
        explanation: 'LED bulbs use up to 80% less energy than traditional incandescent bulbs and last much longer.',
        points: 15
      },
      {
        question: 'What temperature should you set your thermostat to in winter for maximum efficiency?',
        options: ['65°F (18°C)', '68°F (20°C)', '72°F (22°C)', '75°F (24°C)'],
        correctAnswer: 1,
        explanation: 'Setting your thermostat to 68°F (20°C) in winter provides a good balance between comfort and energy efficiency.',
        points: 15
      },
      {
        question: 'Which appliance typically uses the most energy in a home?',
        options: ['Television', 'Refrigerator', 'Washing machine', 'Microwave'],
        correctAnswer: 1,
        explanation: 'Refrigerators run continuously and typically consume the most energy among household appliances.',
        points: 15
      },
      {
        question: 'What is phantom power (vampire power)?',
        options: ['Power from solar panels at night', 'Energy used by electronics when turned off', 'Backup battery power', 'Power from wind turbines'],
        correctAnswer: 1,
        explanation: 'Phantom power is the energy consumed by electronic devices even when they are turned off but still plugged in.',
        points: 15
      },
      {
        question: 'How much can you save by unplugging devices when not in use?',
        options: ['5%', '10%', '15%', '20%'],
        correctAnswer: 1,
        explanation: 'Unplugging devices can save up to 10% on your energy bill by eliminating phantom power consumption.',
        points: 15
      }
    ]
  },
  {
    title: 'Water Conservation',
    category: 'Water',
    difficulty: 'easy',
    timeLimit: 12,
    questions: [
      {
        question: 'How much water does a leaking faucet waste per day?',
        options: ['1 gallon', '5 gallons', '10 gallons', '20 gallons'],
        correctAnswer: 2,
        explanation: 'A leaking faucet can waste up to 10 gallons of water per day, adding up to over 3,000 gallons per year.',
        points: 10
      },
      {
        question: 'What is the best time to water your lawn to minimize evaporation?',
        options: ['Midday', 'Early morning', 'Late afternoon', 'Evening'],
        correctAnswer: 1,
        explanation: 'Watering in early morning minimizes evaporation and allows water to soak into the soil before the heat of the day.',
        points: 10
      },
      {
        question: 'How much water does taking a 5-minute shower typically use?',
        options: ['10 gallons', '15 gallons', '25 gallons', '40 gallons'],
        correctAnswer: 0,
        explanation: 'A 5-minute shower typically uses about 10 gallons of water with a low-flow showerhead.',
        points: 10
      },
      {
        question: 'Which activity wastes the most water?',
        options: ['Brushing teeth with water running', 'Running dishwasher half-full', 'Hosing down driveway', 'All waste equal amounts'],
        correctAnswer: 2,
        explanation: 'Hosing down a driveway can waste up to 150 gallons of water, making it one of the most wasteful water activities.',
        points: 10
      },
      {
        question: 'What percentage of the Earth\'s water is freshwater available for human use?',
        options: ['1%', '3%', '10%', '25%'],
        correctAnswer: 1,
        explanation: 'Only about 3% of Earth\'s water is freshwater, and less than 1% of that is readily available for human use.',
        points: 10
      }
    ]
  },
  {
    title: 'Climate Change Basics',
    category: 'Climate',
    difficulty: 'hard',
    timeLimit: 20,
    questions: [
      {
        question: 'What is the primary greenhouse gas responsible for climate change?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        correctAnswer: 2,
        explanation: 'Carbon dioxide (CO2) is the primary greenhouse gas contributing to climate change, mainly from burning fossil fuels.',
        points: 20
      },
      {
        question: 'What is the Paris Agreement goal for global temperature increase?',
        options: ['1°C', '1.5°C', '2°C', '2.5°C'],
        correctAnswer: 1,
        explanation: 'The Paris Agreement aims to limit global warming to 1.5°C above pre-industrial levels.',
        points: 20
      },
      {
        question: 'Which sector contributes most to global greenhouse gas emissions?',
        options: ['Agriculture', 'Transportation', 'Energy', 'Industry'],
        correctAnswer: 2,
        explanation: 'The energy sector, including electricity and heat production, contributes the most to global greenhouse gas emissions.',
        points: 20
      },
      {
        question: 'What is carbon footprint?',
        options: ['Physical footprint size', 'Amount of carbon emissions from activities', 'Size of carbon particles', 'Carbon storage capacity'],
        correctAnswer: 1,
        explanation: 'Carbon footprint is the total amount of greenhouse gases emitted directly or indirectly by activities.',
        points: 20
      },
      {
        question: 'Which renewable energy source is growing fastest globally?',
        options: ['Solar', 'Wind', 'Hydroelectric', 'Geothermal'],
        correctAnswer: 0,
        explanation: 'Solar energy is currently the fastest-growing renewable energy source globally due to decreasing costs and increasing efficiency.',
        points: 20
      }
    ]
  },
  {
    title: 'Sustainable Living',
    category: 'Lifestyle',
    difficulty: 'medium',
    timeLimit: 15,
    questions: [
      {
        question: 'What is zero waste living?',
        options: ['Not producing any trash', 'Minimizing waste sent to landfills', 'Only using recycled products', 'Composting everything'],
        correctAnswer: 1,
        explanation: 'Zero waste living aims to minimize waste sent to landfills through reducing, reusing, recycling, and composting.',
        points: 15
      },
      {
        question: 'Which transportation method has the lowest carbon footprint per mile?',
        options: ['Driving alone', 'Carpooling', 'Public transit', 'Bicycling'],
        correctAnswer: 3,
        explanation: 'Bicycling has virtually zero carbon emissions and is the most sustainable transportation method.',
        points: 15
      },
      {
        question: 'What is the most effective way to reduce your environmental impact?',
        options: ['Recycling more', 'Using reusable bags', 'Consuming less', 'Buying eco-friendly products'],
        correctAnswer: 2,
        explanation: 'Consuming less overall has the biggest impact, as it reduces resource extraction, manufacturing, and waste.',
        points: 15
      },
      {
        question: 'Which food has the highest carbon footprint?',
        options: ['Rice', 'Chicken', 'Beef', 'Vegetables'],
        correctAnswer: 2,
        explanation: 'Beef production has the highest carbon footprint among common foods due to methane emissions and land use.',
        points: 15
      },
      {
        question: 'What is fast fashion\'s main environmental impact?',
        options: ['Water pollution', 'Carbon emissions', 'Textile waste', 'All of the above'],
        correctAnswer: 3,
        explanation: 'Fast fashion contributes to water pollution, carbon emissions, and massive textile waste, making it highly unsustainable.',
        points: 15
      }
    ]
  },
  {
    title: 'Biodiversity & Ecosystems',
    category: 'Nature',
    difficulty: 'hard',
    timeLimit: 18,
    questions: [
      {
        question: 'What is biodiversity?',
        options: ['Animal diversity only', 'Plant diversity only', 'Variety of life in all forms', 'Genetic variation only'],
        correctAnswer: 2,
        explanation: 'Biodiversity encompasses all living things and their interactions, including genetic, species, and ecosystem diversity.',
        points: 20
      },
      {
        question: 'What is the main cause of species extinction?',
        options: ['Natural disasters', 'Climate change', 'Habitat destruction', 'Hunting'],
        correctAnswer: 2,
        explanation: 'Habitat destruction is the primary cause of species extinction, as it removes the places where species live and reproduce.',
        points: 20
      },
      {
        question: 'What percentage of the world\'s oxygen comes from oceans?',
        options: ['30%', '50%', '70%', '90%'],
        correctAnswer: 2,
        explanation: 'Ocean phytoplankton produce approximately 70% of the world\'s oxygen through photosynthesis.',
        points: 20
      },
      {
        question: 'What is an ecosystem service?',
        options: ['Paid environmental programs', 'Benefits humans get from nature', 'Government environmental agencies', 'Environmental education'],
        correctAnswer: 1,
        explanation: 'Ecosystem services are the benefits that humans obtain from ecosystems, such as clean air, water, and food.',
        points: 20
      },
      {
        question: 'Which ecosystem stores the most carbon?',
        options: ['Forests', 'Grasslands', 'Oceans', 'Wetlands'],
        correctAnswer: 2,
        explanation: 'Oceans store the most carbon of any ecosystem, absorbing about 25% of human CO2 emissions.',
        points: 20
      }
    ]
  }
];

// Calculate total points for each quiz
quizData.forEach(quiz => {
  quiz.totalPoints = quiz.questions.reduce((total, question) => total + question.points, 0);
});

module.exports = quizData;
