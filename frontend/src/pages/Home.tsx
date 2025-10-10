import { Link } from "react-router-dom";
import { Shield, ShieldCheck, Server, Cpu, Database, ArrowRight, Zap, Lock, Globe } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8 animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp">
            <span className="gradient-text">Kube Credential</span>
            <br />
            <span className="text-gray-700 dark:text-gray-300">System</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fadeInUp">
            A modern, secure, and scalable credential issuance and verification platform 
            powered by microservices architecture, Docker, and Kubernetes
          </p>
          
          <div className="flex gap-6 justify-center flex-wrap animate-fadeInUp">
            <Link to="/issuance" className="group">
              <button className="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <Shield className="h-6 w-6" />
                  <span className="font-semibold text-lg">Issue Credential</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </Link>
            
            <Link to="/verification" className="group">
              <button className="relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <ShieldCheck className="h-6 w-6" />
                  <span className="font-semibold text-lg">Verify Credential</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Platform Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built with modern technologies for maximum security, scalability, and performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Server className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Microservices Architecture</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Independent issuance and verification services, each scalable and containerized with Docker for maximum flexibility
              </p>
            </div>
          </div>

          <div className="group relative p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Kubernetes Orchestration</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Multi-worker deployments with horizontal pod autoscaling and health monitoring for enterprise-grade reliability
              </p>
            </div>
          </div>

          <div className="group relative p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Persistent Storage</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                SQLite databases with persistent volume claims for reliable credential tracking and data integrity
              </p>
            </div>
          </div>

          <div className="group relative p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:border-yellow-300 dark:hover:border-yellow-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">High Performance</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Optimized for speed with efficient hashing algorithms and fast database operations for instant responses
              </p>
            </div>
          </div>

          <div className="group relative p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Security First</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                SHA-256 hashing, JWT tokens, and secure credential storage ensure maximum protection of sensitive data
              </p>
            </div>
          </div>

          <div className="group relative p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Cloud Ready</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Designed for cloud deployment with AWS EKS support and scalable infrastructure for global accessibility
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
