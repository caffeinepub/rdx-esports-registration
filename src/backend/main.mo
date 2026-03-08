import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Iter "mo:core/Iter";



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

  type ShortUrl = {
    code : Text;
    originalUrl : Text;
    createdAt : Int;
    clicks : Nat;
  };

  let registrations = Map.empty<Text, Registration>();
  let shortUrls = Map.empty<Text, ShortUrl>();

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

  module ShortUrl {
    public func create(code : Text, originalUrl : Text) : ShortUrl {
      {
        code;
        originalUrl;
        createdAt = Time.now();
        clicks = 0;
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

  public shared ({ caller }) func deleteAllRegistrations() : async Nat {
    let count = registrations.size();
    registrations.clear();
    count;
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

  public shared ({ caller }) func createShortUrl(code : Text, originalUrl : Text) : async ?ShortUrl {
    if (shortUrls.containsKey(code)) {
      null;
    } else {
      let shortUrl = ShortUrl.create(code, originalUrl);
      shortUrls.add(code, shortUrl);
      ?shortUrl;
    };
  };

  public shared ({ caller }) func resolveShortUrl(code : Text) : async ?Text {
    switch (shortUrls.get(code)) {
      case (?shortUrl) {
        let updatedShortUrl = { shortUrl with clicks = shortUrl.clicks + 1 };
        shortUrls.add(code, updatedShortUrl);
        ?shortUrl.originalUrl;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func listShortUrls() : async [ShortUrl] {
    shortUrls.values().toArray();
  };

  public shared ({ caller }) func deleteShortUrl(code : Text) : async Bool {
    if (shortUrls.containsKey(code)) {
      shortUrls.remove(code);
      true;
    } else {
      false;
    };
  };
};
