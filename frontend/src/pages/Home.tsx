import { Link } from "react-router-dom";
import { Shield, ShieldCheck, Server, Cpu, Database, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-blue-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Kube Credential</h1>
          </div>
          <nav className="flex gap-2">
            <Link to="/issuance">
              <button>Issuance</button>
            </Link>
            <Link to="/verification">
              <button>Verification</button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
            <Shield className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
          Kube Credential System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Microservices-based credential issuance and verification platform built with Node.js, Docker, and Kubernetes
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/issuance">
            <button className="bg-gradient-to-r from-indigo-300 to-indigo-600
            transition-opacity shadow-md text-white rounded-md p-2
            hover:scale-105 transition duration-300 ease-in 
            ">
                <div className="flex flex-col gap-2 justify-center items-center">
                <Shield className="text-white h-5 w-5" />
                Issue Credential
              <ArrowRight className="text-white h-5 w-5" />
                </div>

            </button>
          </Link>
          <Link to="/verification">
            <button className="bg-gradient-to-r from-indigo-300 to-indigo-600
            transition-opacity shadow-md text-white rounded-md p-2
            hover:scale-105 transition duration-300 ease-in ">
            <div className="flex flex-col gap-2 justify-center items-center">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Verify Credential
                <ArrowRight className="ml-2 h-5 w-5" />
            </div>
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-border/50 hover:shadow-lg transition-shadow">
            <div className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Microservices Architecture</h3>
              <p className="text-sm text-muted-foreground">
                Independent issuance and verification services, each scalable and containerized with Docker
              </p>
            </div>
          </div>

          <div className="border-border/50 hover:shadow-lg transition-shadow">
            <div className="pt-6">
              <div className="p-3 rounded-lg bg-accent/10 w-fit mb-4">
                <Cpu className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Kubernetes Orchestration</h3>
              <p className="text-sm text-muted-foreground">
                Multi-worker deployments with horizontal pod autoscaling and health monitoring
              </p>
            </div>
          </div>

          <div className="border-border/50 hover:shadow-lg transition-shadow">
            <div className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Persistent Storage</h3>
              <p className="text-sm text-muted-foreground">
                SQLite databases with persistent volume claims for reliable credential tracking
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
