const About = () => {
  return (
    <section id="about" className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image/Illustration */}
          <div className="relative animate-fadeInLeft">
            <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl p-8 border border-white/10">
              <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-8xl opacity-50">👨‍💻</span>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
          </div>

          {/* Content */}
          <div className="animate-fadeInRight">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Hi, I'm Hariom Raj Chauhan — but you can call me <span className="text-cyan-400">Harry</span>
            </h3>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              I'm a <strong className="text-white">3rd year Computer Engineering student</strong> at 
              <strong className="text-white"> IOE Purwanchal Campus</strong>, Dharan, Nepal (Roll No. PUR080BCT033). 
              What sets me apart is my unique blend of <strong className="text-cyan-400">software engineering skills</strong> and 
              <strong className="text-purple-400"> creative design background</strong>.
            </p>

            <p className="text-gray-300 mb-6 leading-relaxed">
              As the <strong className="text-white">Technical Manager at ACES</strong> (Association of Computer Engineering Students), 
              I've spent nearly 2 years honing my graphics design skills while also leading technical initiatives. 
              I served as the <strong className="text-white">Graphics Lead for Taranga: The Wave of Technology</strong>, 
              a national-level tech fest, where I managed all visual aspects of the event.
            </p>

            <p className="text-gray-300 mb-8 leading-relaxed">
              My career goal is to secure an <strong className="text-cyan-400">internship or junior role</strong> in 
              full-stack development, AI/ML engineering, or UI/UX design. I believe my dual expertise in both 
              technical implementation and visual design makes me uniquely positioned to create products that are 
              not only functional but also delightful to use.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-white/5">
                <div className="text-2xl font-bold text-cyan-400">3+</div>
                <div className="text-sm text-gray-400">Years Coding</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-white/5">
                <div className="text-2xl font-bold text-purple-400">2 yrs</div>
                <div className="text-sm text-gray-400">Design Experience</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-white/5">
                <div className="text-2xl font-bold text-pink-400">10+</div>
                <div className="text-sm text-gray-400">Projects Built</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
