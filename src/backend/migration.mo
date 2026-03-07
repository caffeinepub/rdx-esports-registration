import Map "mo:core/Map";

module {
  type Registration = {
    id : Text;
    teamName : Text;
    response : Text;
    phoneNumber : Text;
    whatsappLink : Text;
    registeredAt : Int;
    teamLogoUrl : ?Blob;
    playerPhotoUrl : ?Blob;
    paymentScreenshotUrl : ?Blob;
    proofOfPaymentUrl : ?Blob;
    referredBy : ?Text;
  };

  type Actor = {
    registrations : Map.Map<Text, Registration>;
    nextId : Nat;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
