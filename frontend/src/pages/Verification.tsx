import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle, XCircle, Loader2, Info } from "lucide-react";

interface CredentialForm {
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate: string;
  additionalData: string;
}

interface VerificationResult {
  valid: boolean;
  message: string;
  workerId: string;
  timestamp: string;
  credentialDetails?: {
    id: string;
    issuedBy: string;
    issuedAt: string;
  };
}

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [formData, setFormData] = useState<CredentialForm>({
    holderName: "",
    credentialType: "",
    issueDate: "",
    expiryDate: "",
    additionalData: ""
  });

  const handleInputChange = (field: keyof CredentialForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Prepare credential data
      const credentialData: any = {
        holderName: formData.holderName.trim(),
        credentialType: formData.credentialType.trim()
      };

      if (formData.issueDate) {
        credentialData.issueDate = formData.issueDate;
      }

      if (formData.expiryDate) {
        credentialData.expiryDate = formData.expiryDate;
      }

      if (formData.additionalData.trim()) {
        try {
          credentialData.data = JSON.parse(formData.additionalData);
        } catch {
          credentialData.data = { notes: formData.additionalData };
        }
      }

      // Call verification API
      const API_URL = import.meta.env.VITE_VERIFICATION_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialData)
      });

      const verificationResult = await response.json();
      setResult(verificationResult);

      if (verificationResult.valid) {
        toast.success("Credential Verified", {
          description: verificationResult.message,
          icon: <CheckCircle className="h-5 w-5" />
        });
      } else {
        toast.error("Verification Failed", {
          description: verificationResult.message,
          icon: <XCircle className="h-5 w-5" />
        });
      }
    } catch (error) {
      toast.error("Verification Error", {
        description: error instanceof Error ? error.message : "Network error",
        icon: <XCircle className="h-5 w-5" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg">
              <ShieldCheck className="h-8 w-8 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            Credential Verification
          </h1>
          <p className="text-muted-foreground text-lg">
            Verify the authenticity of issued credentials
          </p>
        </div>

        {/* Verification Form */}
        <div className="shadow-lg border-border/50">
          <div>
            <div>Verify Credential</div>
            <div>
              Enter credential details to verify its authenticity
            </div>
          </div>
          <div>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="holderName">Holder Name *</label>
                  <input
                    id="holderName"
                    placeholder="John Doe"
                    value={formData.holderName}
                    onChange={(e) => handleInputChange('holderName', e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="credentialType">Credential Type *</label>
                  <input
                    id="credentialType"
                    placeholder="Certificate, License, Badge, etc."
                    value={formData.credentialType}
                    onChange={(e) => handleInputChange('credentialType', e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="issueDate">Issue Date (Optional)</label>
                  <input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className="border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="expiryDate">Expiry Date (Optional)</label>
                  <input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="additionalData">Additional Data (Optional JSON)</label>
                <textarea
                  id="additionalData"
                  placeholder='{"score": 95, "institution": "XYZ University"}'
                  value={formData.additionalData}
                  onChange={(e) => handleInputChange('additionalData', e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-border/50 bg-background text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-accent to-accent/80 hover:opacity-90 transition-opacity shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Verify Credential
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Verification Result */}
        {result && (
          <div className={`shadow-lg border-2 ${result.valid ? 'border-accent bg-accent/5' : 'border-destructive bg-destructive/5'}`}>
            <div className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {result.valid ? (
                    <CheckCircle className="h-8 w-8 text-accent" />
                  ) : (
                    <XCircle className="h-8 w-8 text-destructive" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">
                      {result.valid ? 'Credential Valid' : 'Credential Invalid'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Verified By</p>
                    <p className="font-mono text-sm font-semibold">{result.workerId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="font-mono text-sm">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {result.credentialDetails && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold text-sm">Credential Details</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Credential ID</p>
                        <p className="font-mono text-sm">{result.credentialDetails.id}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Issued By</p>
                          <p className="font-mono text-sm">{result.credentialDetails.issuedBy}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Issued At</p>
                          <p className="font-mono text-sm">
                            {new Date(result.credentialDetails.issuedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="border-accent/20 bg-accent/5">
          <div className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Info className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">Verification Process</h3>
                <p className="text-sm text-muted-foreground">
                  The verification service checks the credential against the issuance database and returns
                  the worker ID that processed the verification along with the original issuance details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
