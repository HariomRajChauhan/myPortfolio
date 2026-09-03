const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute inset-2 border-4 border-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute inset-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex items-center gap-2 justify-center text-gray-400">
          <span className="animate-pulse">Loading</span>
          <span className="flex gap-1">
            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
