const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://anshe2925:U0G5Tc8k7IzRcYE5@cluster0.fruolwk.mongodb.net/';

// Department ObjectId to name mapping
const departmentMap = {
  '507f1f77bcf86cd799439011': 'Engineering',
  '507f1f77bcf86cd799439012': 'Human Resources',
  '507f1f77bcf86cd799439013': 'Finance',
  '507f1f77bcf86cd799439014': 'Marketing',
  '507f1f77bcf86cd799439015': 'Operations',
  '507f1f77bcf86cd799439016': 'Sales',
  '507f1f77bcf86cd799439017': 'Design',
};

async function fixDepartments() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users with department as ObjectId
    const users = await usersCollection.find({}).toArray();
    
    console.log(`Found ${users.length} users`);
    
    let updated = 0;
    for (const user of users) {
      if (user.department) {
        let departmentName = user.department;
        
        // If department is an ObjectId
        if (typeof user.department === 'object' && user.department._bsontype === 'ObjectID') {
          const objectIdStr = user.department.toString();
          departmentName = departmentMap[objectIdStr] || 'Engineering';
          console.log(`Converting ObjectId ${objectIdStr} to ${departmentName} for user ${user.email}`);
        } else if (mongoose.Types.ObjectId.isValid(user.department) && user.department.length === 24) {
          // If department is a string but looks like an ObjectId
          departmentName = departmentMap[user.department] || 'Engineering';
          console.log(`Converting ObjectId string ${user.department} to ${departmentName} for user ${user.email}`);
        }
        
        // Update user with department name
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { department: departmentName } }
        );
        updated++;
      }
    }
    
    console.log(`✅ Updated ${updated} users with department names`);
    
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDepartments();
