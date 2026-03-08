import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    registrations : Map.Map<Text, {
      id : Text;
      teamName : Text;
      response : Text;
      phoneNumber : Text;
      whatsappLink : Text;
      registeredAt : Int;
      teamLogoUrl : ?Storage.ExternalBlob;
      playerPhotoUrl : ?Storage.ExternalBlob;
      paymentScreenshotUrl : ?Storage.ExternalBlob;
      proofOfPaymentUrl : ?Storage.ExternalBlob;
      referredBy : ?Text;
    }>;
    nextId : Nat;
  };

  type NewActor = {
    registrations : Map.Map<Text, {
      id : Text;
      teamName : Text;
      response : Text;
      phoneNumber : Text;
      whatsappLink : Text;
      registeredAt : Int;
      teamLogoUrl : ?Storage.ExternalBlob;
      playerPhotoUrl : ?Storage.ExternalBlob;
      paymentScreenshotUrl : ?Storage.ExternalBlob;
      proofOfPaymentUrl : ?Storage.ExternalBlob;
      referredBy : ?Text;
    }>;
    nextId : Nat;
    shortUrls : Map.Map<Text, {
      code : Text;
      originalUrl : Text;
      createdAt : Int;
      clicks : Nat;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    let shortUrls = Map.empty<Text, {
      code : Text;
      originalUrl : Text;
      createdAt : Int;
      clicks : Nat;
    }>();
    { old with shortUrls };
  };
};
