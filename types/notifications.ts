interface Notification {
    offerType: 'NAB Digital Messages';
    priorityMessage?: boolean; // Indicates if the message is high priority
    notificationTitle: string; // Title used by Kong API
    content?: string; // Content/body used by Kong API
    iconIBDesktop?: string; // Icon for IB Desktop and NAB App's Notification Page
    iconColour?: string; // Color of the icon
    photoIBDesktop?: string; // Photo for IB Desktop spaces
    photoNABApp?: string; // Photo for NAB App spaces
    imageUrlNABApp?: string; // Icon used for NAB App Notification Spaces
    callToAction: string; // Call to action text
    presentationRules: PresentationRule; // Presentation rules dropdown
    ctaFlowType: CTAFlowType; // CTA flow type dropdown
    webViewDetails?: WebViewDetails; // Details if ctaFlowType is 'WebViewOnly'
    nativePageDetails?: NativePageDetails; // Details if ctaFlowType is 'NativePage'
    personalisationVars?: PersonalisationVar[]; // Up to 5 personalization variables
  }
  
  type PresentationRule = 'OneTime' | 'Always' | 'UntilInteracted' | 'OnEvent'; // Example values
  type CTAFlowType = 'WebViewOnly' | 'NativePage' | 'Dismiss';
  
  interface WebViewDetails {
    webViewTitle: string;
    externalBrowser: boolean;
    externalUrlIBDesktop?: string;
    externalUrlNABApp?: string;
  }
  
  interface NativePageDetails {
    targetIBDesktop: string;
    targetNABApp: string;
  }
  
  interface PersonalisationVar {
    label: string; // Label for the personalization variable
    schema: string; // Schema used (must contain PartyID or AgreementID)
    field: string; // Field to use, can include functions like Smart()
    whereExp?: string; // Optional where expression
    equals?: string; // Value for the where expression
  }

  export type { Notification };