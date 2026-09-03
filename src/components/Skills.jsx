const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming & Development',
      icon: '💻',
      color: 'from-cyan-500 to-blue-600',
      skills: [
        { name: 'C++', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'React', level: 80 },
        { name: 'React Native', level: 70 },
        { name: 'Node.js/Express', level: 75 },
        { name: 'MongoDB', level: 75 },
        { name: 'MERN Stack', level: 75 },
        { name: 'TCP/Socket Programming', level: 70 },
        { name: 'Python', level: 65 },
        { name: 'CNN/LSTM (AI)', level: 60 },
      ],
    },
    {
      title: 'Design & Creative',
      icon: '🎨',
      color: 'from-purple-500 to-pink-600',
      skills: [
        { name: 'Figma (UI/UX)', level: 85 },
        { name: 'Adobe Photoshop', level: 80 },
        { name: 'Adobe InDesign', level: 75 },
        { name: 'Canva', level: 90 },
        { name: 'Graphic Design Theory', level: 80 },
      ],
    },
    {
      title: 'Other Skills',
      icon: '⚡',
      color: 'from-orange-500 to-red-600',
      skills: [
        { name: 'Video Editing', level: 70 },
        { name: 'Social Media Management', level: 75 },
        { name: 'LaTeX (Documentation)', level: 80 },
        { name: 'Technical Writing', level: 75 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            A comprehensive toolkit spanning software development, creative design, and technical communication
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className="bg-gray-900/50 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 hover:transform hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-xl font-semibold text-white">{category.title}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{skill.name}</span>
                      <span className="text-sm text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Icons Grid */}
        <div className="mt-16 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-center text-gray-400 mb-8">Technologies I work with</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'Node.js', 'Express', 'MongoDB', 'C++', 'Python', 'Figma', 'Photoshop', 'Git', 'TCP/IP', 'LaTeX', 'REST API'].map((tech, index) => (
              <div
                key={tech}
                className="px-4 py-2 bg-gray-800/50 rounded-lg border border-white/5 text-gray-300 text-sm hover:bg-gray-800 hover:border-cyan-400/50 transition-colors cursor-default"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
