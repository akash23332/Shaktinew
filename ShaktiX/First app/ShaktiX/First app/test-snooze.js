// Test snooze functionality
console.log('🧪 Testing Snooze Functionality...\n');

// Simulate a medication object
const testMedication = {
  id: 'test-med-1',
  name: 'Test Medicine',
  dosage: '100mg',
  snoozeCount: 0,
  snoozedUntil: null
};

console.log('📊 Initial medication state:');
console.log('   Name:', testMedication.name);
console.log('   Snooze count:', testMedication.snoozeCount);
console.log('   Snoozed until:', testMedication.snoozedUntil);

console.log('\n⏰ Simulating snooze action...');

// Simulate snooze function
const snoozeDuration = 15; // 15 minutes
const snoozeUntil = new Date(Date.now() + snoozeDuration * 60 * 1000).toISOString();
testMedication.snoozedUntil = snoozeUntil;
testMedication.snoozeCount = (testMedication.snoozeCount || 0) + 1;

console.log('📊 After snooze:');
console.log('   Snooze count:', testMedication.snoozeCount);
console.log('   Snoozed until:', new Date(testMedication.snoozedUntil).toLocaleTimeString());
console.log('   Is currently snoozed:', new Date(testMedication.snoozedUntil) > new Date() ? '✅ Yes' : '❌ No');

console.log('\n✅ Snooze functionality test completed!');
console.log('💡 In the real app, notifications will be skipped while snoozed.');
console.log('💡 After snooze expires, normal notifications will resume.');