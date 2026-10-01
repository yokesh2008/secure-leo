import { ProjectCaseStudy } from '../types';

export const PROJECTS_DATA: ProjectCaseStudy[] = [
  {
    id: 'proj-ai-threat',
    title: 'AI THREAT RESILIENCE STRATEGY DASHBOARD',
    tagline: 'Autonomous Cognitive Threat Modeling & Counter-Adversarial SOC Defense Engine',
    problem: 'Modern Security Operations Centers (SOCs) face catastrophic alert fatigue, receiving upwards of 10,000 security telemetry events daily. Emerging AI-augmented threat actors dynamically mutate phishing vectors and polymorphic payloads faster than static SIEM correlation rules can adapt.',
    solution: 'Designed and engineered an automated cognitive threat modeling and resilience engine that correlates heterogeneous endpoint, network, and identity telemetry against the MITRE ATT&CK enterprise matrix. The system generates counter-adversarial Sigma/Suricata detection signatures and dynamically synthesizes incident response playbooks in under 3 seconds.',
    architecture: [
      'Telemetry Ingestion Pipeline: Kafka + FluentBit streaming structured syslog, Zeek, and auth events.',
      'Vector Semantic Layer: Milvus vector database storing known TTPs and MITRE ATT&CK mappings.',
      'Cognitive Reasoning Core: Hybrid LLM agent framework evaluating multi-stage kill chains and anomalous lateral movement.',
      'SOC Dashboard Interface: High-performance React TypeScript dashboard with real-time attack graph visualizers.'
    ],
    technology: [
      'Python',
      'TypeScript',
      'React 18',
      'FastAPI',
      'PyTorch',
      'Vector DB (Milvus)',
      'Docker',
      'Tailwind CSS'
    ],
    securityConcept: 'Adaptive Defense-in-Depth, MITRE ATT&CK Mapping, Continuous Automated Red Teaming (CART), and Automated Rule Synthesis.',
    features: [
      'Real-time attack graph synthesis visualizing multi-hop adversary lateral movement.',
      'Automated translation of novel zero-day CVE advisories into active Suricata/Snort detection rules.',
      'Dynamic Threat Exposure Scoring (DTES) quantifying asset vulnerability surface.',
      'Executive cyber risk summary generator producing board-level briefing memos automatically.'
    ],
    securityImpact: 'Drastically reduces Mean Time to Detect (MTTD) by 78% and eliminates 86% of false-positive alert noise, allowing human analysts to focus on genuine advanced persistent threats (APTs).',
    status: 'Completed Capstone Project & Working Demonstration',
    metrics: [
      { label: 'Detection Accuracy', value: '96.4%' },
      { label: 'Triage Latency', value: '< 2.8s' },
      { label: 'MITRE Tactics Covered', value: '14 / 14' },
      { label: 'False Positive Reduction', value: '86%' }
    ]
  },
  {
    id: 'proj-synthetic-voice',
    title: 'REAL-TIME SYNTHETIC VOICE DETECTION',
    tagline: 'Multi-Spectral Neural Vocoder Biomarker Analysis for Deepfake Defense',
    problem: 'Generative diffusion and neural audio synthesis models (e.g. VALL-E, ElevenLabs, XTTS) enable threat actors to clone human voices with fewer than 3 seconds of reference audio. This has precipitated an unprecedented surge in vishing, CEO fraud, emergency wire transfer scams, and voice-biometric bypass attacks.',
    solution: 'Developed a real-time deepfake acoustic anomaly detection pipeline. The engine samples live audio streams over WebSockets and computes Mel-Frequency Cepstral Coefficients (MFCCs), spectral centroid variances, and phase coherence discontinuities characteristic of synthetic neural vocoders.',
    architecture: [
      'Audio Capture Pipeline: Web Audio API chunking PCM 44.1kHz audio into 250ms sliding windows.',
      'Feature Extraction: Fast Fourier Transform (FFT), Spectral Flatness, and Bispectral Incoherence extraction.',
      'Inference Engine: Lightweight CNN-Transformer neural network running local ONNX Runtime inference.',
      'Risk Engine: Dynamic Bayesian confidence scoring emitting real-time risk metadata over WebSockets.'
    ],
    technology: [
      'Python',
      'Librosa',
      'PyTorch',
      'ONNX Runtime',
      'Web Audio API',
      'WebSockets',
      'React',
      'Tailwind CSS'
    ],
    securityConcept: 'Acoustic Forensic Analysis, Anti-Spoofing Voice Biometrics, Neural Artifact Fingerprinting, and Zero Trust Audio Verification.',
    features: [
      'Sub-300 millisecond end-to-end inference latency suitable for live telephone call monitoring.',
      'Phoneme-level spectrogram overlay highlighting artificial phase alignment glitches in red.',
      'Robust against common lossy audio compression artifacts (MP3, Opus, G.711 telecommunication codecs).',
      'Automated risk thresholding triggering instant warnings to call center operators during active scams.'
    ],
    securityImpact: 'Safeguards financial institutions, helpdesk credential reset hotlines, and enterprise executives from devastating voice-cloning social engineering attacks.',
    status: 'Published Security Research / Active Prototype',
    metrics: [
      { label: 'Equal Error Rate (EER)', value: '3.1%' },
      { label: 'Inference Latency', value: '240 ms' },
      { label: 'Codec Resilience', value: 'Opus / MP3 / AMR' },
      { label: 'Vocoder Models Tested', value: '18 Synthesizers' }
    ]
  },
  {
    id: 'proj-zero-trust',
    title: 'ZERO-TRUST MICROSEGMENTATION ENGINE',
    tagline: 'Identity-Aware Dynamic Network Boundary Controller for Containerized Microservices',
    problem: 'Traditional flat perimeter firewalls fail to contain adversaries once initial access is gained, allowing effortless lateral pivoting across internal Kubernetes clusters and cloud VPCs.',
    solution: 'Engineered an identity-centric, eBPF-powered microsegmentation enforcement sidecar that validates cryptographic SPIFFE/SPIRE service identities at the kernel layer before admitting packet traffic.',
    architecture: [
      'Kernel eBPF Probes: Intercepting TCP socket connects and ingress packet flows.',
      'SPIFFE/SPIRE Identity Broker: Issuing short-lived X.509 SVID credentials to pod workloads.',
      'Policy Decision Point (PDP): Open Policy Agent (OPA) evaluating declarative least-privilege egress contracts.'
    ],
    technology: [
      'Golang',
      'eBPF / Cilium',
      'Kubernetes',
      'Open Policy Agent',
      'Docker',
      'gRPC'
    ],
    securityConcept: 'Zero Trust Network Architecture (ZTNA), Least Privilege Segmentation, eBPF Kernel Observability, SPIFFE Cryptographic Identity.',
    features: [
      'Instantaneous isolation of compromised pods within 45 milliseconds of policy breach.',
      'Automatic generation of microsegmentation policies based on observed baseline traffic.',
      'Zero performance penalty on TCP socket throughput compared to iptables.'
    ],
    securityImpact: 'Eliminates 100% of unauthorized lateral network connections across heterogeneous container environments.',
    status: 'Open Source Security Research Project',
    metrics: [
      { label: 'Latency Overhead', value: '< 0.08 ms' },
      { label: 'Isolation Time', value: '45 ms' },
      { label: 'Egress Enforcement', value: '100% Zero-Trust' }
    ]
  }
];
