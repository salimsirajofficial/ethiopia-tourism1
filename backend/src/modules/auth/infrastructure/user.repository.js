
const { Op } = require('sequelize');
const User = require('./user.model');
const UserEntity = require('../domain/user.entity');

/** Maps a Sequelize record to a plain data-transfer object (includes sensitive fields). */
const toDTO = (record) => ({
  id: record.id,
  fullName: record.full_name,
  username: record.username,
  email: record.email,
  password: record.password,
  googleId: record.google_id,
  avatarUrl: record.avatar_url,
  status: record.status,
  explorerLevel: record.explorer_level,
  nationalIdNumber: record.national_id_number,
  passportNumber: record.passport_number,
  phoneNumber: record.phone_number,
  createdAt: record.created_at,
});

/** Maps a Sequelize record to a domain UserEntity. */
const toEntity = (record) => new UserEntity(toDTO(record));

const UserRepository = {

  /** Find user by their numeric primary key. Used by dashboard. */
  async findById(id) {
    const record = await User.findByPk(id);
    return record ? toDTO(record) : null;
  },

  async findByEmailOrUsername(email, username) {
    const record = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    return record ? toDTO(record) : null;
  },

  /** Used by login: look up by email or username. */
  async findByIdentifier(identifier) {
    const record = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });
    return record ? toDTO(record) : null;
  },

  /** Used by Google OAuth: find existing account by email or google_id. */
  async findByEmailOrGoogleId(email, googleId) {
    const record = await User.findOne({
      where: { [Op.or]: [{ email }, { google_id: googleId }] },
    });
    return record ? toDTO(record) : null;
  },

  /** Creates a new user row and returns a domain UserEntity. */
  async create(data, options = {}) {
    const record = await User.create(data, options);
    return toEntity(record);
  },

  /** General profile update */
  async updateProfile(id, data) {
    // Map camlCase to snake_case for DB
    const dbData = {};
    if (data.fullName) dbData.full_name = data.fullName;
    if (data.nationalIdNumber !== undefined) dbData.national_id_number = data.nationalIdNumber;
    if (data.passportNumber !== undefined) dbData.passport_number = data.passportNumber;
    if (data.phoneNumber !== undefined) dbData.phone_number = data.phoneNumber;

    const [rows] = await User.update(dbData, { where: { id } });
    if (rows === 0) return null;
    
    // Return fresh data
    const record = await User.findByPk(id);
    return toDTO(record);
  },

  /** Links an existing account to a Google ID after first OAuth login. */
  async updateGoogleId(id, googleId) {
    await User.update({ google_id: googleId }, { where: { id } });
  },
};


module.exports = UserRepository;
