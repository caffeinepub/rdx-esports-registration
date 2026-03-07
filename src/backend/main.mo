import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Registration = {
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
  };

  let registrations = Map.empty<Text, Registration>();

  var nextId = 1;

  module Registration {
    public func create(
      teamName : Text,
      response : Text,
      phoneNumber : Text,
      whatsappLink : Text,
      teamLogoUrl : ?Storage.ExternalBlob,
      playerPhotoUrl : ?Storage.ExternalBlob,
      paymentScreenshotUrl : ?Storage.ExternalBlob,
      proofOfPaymentUrl : ?Storage.ExternalBlob,
      referredBy : ?Text,
    ) : Registration {
      let id = "RDX-" # (nextId + 1000).toText();
      {
        id;
        teamName;
        response;
        phoneNumber;
        whatsappLink;
        teamLogoUrl;
        playerPhotoUrl;
        paymentScreenshotUrl;
        proofOfPaymentUrl;
        referredBy;
        registeredAt = Time.now();
      };
    };
  };

  include MixinStorage();

  public shared ({ caller }) func createRegistration(
    teamName : Text,
    response : Text,
    phoneNumber : Text,
    whatsappLink : Text,
    teamLogoUrl : ?Storage.ExternalBlob,
    playerPhotoUrl : ?Storage.ExternalBlob,
    paymentScreenshotUrl : ?Storage.ExternalBlob,
    proofOfPaymentUrl : ?Storage.ExternalBlob,
    referredBy : ?Text,
  ) : async Registration {
    let registration = Registration.create(
      teamName,
      response,
      phoneNumber,
      whatsappLink,
      teamLogoUrl,
      playerPhotoUrl,
      paymentScreenshotUrl,
      proofOfPaymentUrl,
      referredBy,
    );

    registrations.add(registration.id, registration);
    nextId += 1;
    registration;
  };

  public shared ({ caller }) func deleteRegistration(id : Text) : async Bool {
    if (registrations.containsKey(id)) {
      registrations.remove(id);
      true;
    } else {
      false;
    };
  };

  public query ({ caller }) func getRegistration(id : Text) : async ?Registration {
    registrations.get(id);
  };

  public query ({ caller }) func listRegistrations() : async [Registration] {
    registrations.values().toArray();
  };

  public query ({ caller }) func getRegistrationCount() : async Nat {
    registrations.size();
  };
};
