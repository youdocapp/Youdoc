# BloodType Enum Usage Guide

## Overview

The `BloodType` enum is implemented using Django's `TextChoices` to provide type safety and validation for blood type values in the YouDoc application.

## Implementation

### Backend (Django)

The `BloodType` enum is defined in `authentication/models.py`:

```python
class BloodType(models.TextChoices):
    """
    Blood type choices following international medical standards.
    These are standardized values that rarely change.
    """
    A_POSITIVE = 'A+', 'A+'
    A_NEGATIVE = 'A-', 'A-'
    B_POSITIVE = 'B+', 'B+'
    B_NEGATIVE = 'B-', 'B-'
    AB_POSITIVE = 'AB+', 'AB+'
    AB_NEGATIVE = 'AB-', 'AB-'
    O_POSITIVE = 'O+', 'O+'
    O_NEGATIVE = 'O-', 'O-'
```

### Model Usage

The `User` model uses the enum for the `blood_type` field:

```python
blood_type = models.CharField(
    max_length=5,
    choices=BloodType.choices,
    blank=True,
    null=True,
    help_text="User's blood type"
)
```

## Usage Examples

### 1. Getting All Valid Choices

```python
from authentication.models import BloodType

# Get all valid blood type choices
choices = BloodType.choices
# Returns: [('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ...]

# Get just the values
values = [choice[0] for choice in BloodType.choices]
# Returns: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
```

### 2. Validation

```python
# Check if a value is valid
user_input = "O+"
if user_input in [choice[0] for choice in BloodType.choices]:
    print("Valid blood type")

# Django automatically validates against choices in forms and serializers
```

### 3. Setting Values

```python
# Using enum constants (recommended)
user.blood_type = BloodType.O_POSITIVE  # 'O+'
user.blood_type = BloodType.A_NEGATIVE  # 'A-'

# Using string values (also valid)
user.blood_type = "AB+"
user.blood_type = "B-"
```

### 4. API Serialization

```python
# In serializers, the choices are automatically validated
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['blood_type', ...]
    
    # No additional validation needed - Django handles it
```

### 5. Form Usage

```python
# In Django forms
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['blood_type']
    
    # The form will automatically show a dropdown with all valid choices
```

## Available Blood Types

| Value | Display | Description |
|-------|---------|-------------|
| `A+` | A+ | A Positive |
| `A-` | A- | A Negative |
| `B+` | B+ | B Positive |
| `B-` | B- | B Negative |
| `AB+` | AB+ | AB Positive |
| `AB-` | AB- | AB Negative |
| `O+` | O+ | O Positive |
| `O-` | O- | O Negative |

## Benefits

1. **Type Safety**: Compile-time checking of valid values
2. **Validation**: Automatic Django validation in forms and serializers
3. **Consistency**: Single source of truth for blood type values
4. **Maintainability**: Easy to update if medical standards change
5. **Documentation**: Self-documenting code with clear enum values
6. **IDE Support**: Better autocomplete and refactoring support

## Error Handling

When an invalid blood type is provided, Django will return a validation error:

```json
{
  "error": true,
  "message": "Profile update failed",
  "details": {
    "blood_type": ["\"X+\" is not a valid choice."]
  }
}
```

## Migration Notes

- **No Database Migration Required**: The enum doesn't change the database schema
- **Backward Compatible**: Existing data remains valid
- **No Data Loss**: All existing blood type values are preserved

## Best Practices

1. **Use Enum Constants**: Prefer `BloodType.O_POSITIVE` over `"O+"` for better maintainability
2. **Validate Input**: Always validate user input against the enum choices
3. **Handle Errors**: Provide clear error messages for invalid blood types
4. **Document Changes**: If medical standards change, update the enum and documentation

## React Native Integration

### Frontend Constants Setup

Create a constants file in your React Native project to match the backend enum:

```typescript
// constants/bloodTypes.ts
export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

export type BloodType = typeof BLOOD_TYPES[number];

// For dropdown/selector components
export const BLOOD_TYPE_OPTIONS = BLOOD_TYPES.map(type => ({
  value: type,
  label: type
}));
```

### Component Integration

```typescript
// ProfileScreen.tsx - Replace hardcoded array
import { BLOOD_TYPES } from '../constants/bloodTypes';

// Replace this:
{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((option) => (

// With this:
{BLOOD_TYPES.map((option) => (
```

### API Error Handling

```typescript
// Handle backend validation errors
const handleBloodTypeUpdate = async (bloodType: string) => {
  try {
    const response = await fetch('/api/auth/profile/', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ blood_type: bloodType })
    });

    if (!response.ok) {
      const error = await response.json();
      if (error.details?.blood_type) {
        Alert.alert('Invalid Blood Type', 'Please select a valid blood type');
        return;
      }
      throw new Error(error.message);
    }

    Alert.alert('Success', 'Blood type updated successfully');
  } catch (error) {
    Alert.alert('Error', 'Failed to update blood type');
  }
};
```

### TypeScript Benefits

```typescript
// Type-safe blood type handling
interface User {
  bloodType: BloodType | null;
  // other fields...
}

const ProfileComponent: React.FC<{ user: User }> = ({ user }) => {
  const [bloodType, setBloodType] = useState<BloodType | null>(user.bloodType);
  
  // TypeScript will catch invalid blood types at compile time
  const handleChange = (newType: BloodType) => {
    setBloodType(newType); // ✅ Type-safe
  };
};
```

### Current Implementation Compatibility

Your existing React Native code will work without changes because:

1. **Same Values**: The hardcoded array matches the backend enum exactly
2. **API Contract**: No changes to request/response format
3. **Enhanced Validation**: Backend now provides better error messages
4. **Type Safety**: Optional TypeScript improvements available

## Future Considerations

If blood type standards change (e.g., new types discovered), simply update the enum:

```python
class BloodType(models.TextChoices):
    # Existing types...
    A_POSITIVE = 'A+', 'A+'
    # ... other existing types ...
    
    # New type (hypothetical)
    NEW_TYPE = 'NEW', 'New Type'
```

Then create and run a migration to update the database constraints.

### Frontend Update Required

When backend enum changes, update the frontend constants:

```typescript
// constants/bloodTypes.ts - Update to match backend
export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NEW'
] as const;
```
