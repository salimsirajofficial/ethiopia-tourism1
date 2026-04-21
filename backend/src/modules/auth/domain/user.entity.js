class UserEntity {
  constructor({ id, fullName, username, email, googleId, avatarUrl, status, explorerLevel, nationalIdNumber, passportNumber, phoneNumber, createdAt }) {
    this.id               = id;
    this.fullName         = fullName;
    this.username         = username;
    this.email            = email;
    this.googleId         = googleId || null;
    this.avatarUrl        = avatarUrl || null;
    this.status           = status || 'pending_clearance';
    this.explorerLevel    = explorerLevel || 1;
    this.nationalIdNumber = nationalIdNumber || null;
    this.passportNumber   = passportNumber || null;
    this.phoneNumber      = phoneNumber || null;
    this.createdAt        = createdAt;
  }

  /**
   * Returns the safe public representation of this user.
   * Never includes password or internal fields.
   */
  toPublicProfile() {
    return {
      id:               this.id,
      name:             this.fullName,
      username:         this.username,
      email:            this.email,
      avatarUrl:        this.avatarUrl,
      status:           this.status,
      explorerLevel:    this.explorerLevel,
      nationalIdNumber: this.nationalIdNumber,
      passportNumber:   this.passportNumber,
      phoneNumber:      this.phoneNumber,
      createdAt:        this.createdAt,
    };
  }
}

module.exports = UserEntity;
