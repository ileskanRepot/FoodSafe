import numpy as np
import matplotlib.pyplot as plt

# Load the data from 'map_slice.npy' with 'allow_pickle' set to True
data = np.load('map_slice.npy', allow_pickle=True)

# Check if the data is an array of objects, which is not supported by plt.contourf
if data.dtype == np.object:
    # Attempt to convert the array of objects to a regular numeric array (float)
    # You might need to adjust this step if the conversion is not straightforward
    data = np.array(data.tolist(), dtype=float)

# Now the data should be a numeric type, try to create a contourf plot
plt.contourf(data)
# contour = plt.contourf(data, cmap='viridis')
# contour = plt.contourf(data, cmap='inferno')
# contour = plt.contourf(data, cmap='coolwarm')
contour = plt.contourf(data, cmap='Blues')
# contour = plt.contourf(data, cmap='YlGnBu')


levels = np.arange(70, 100, 2)  # Adjust the step if needed

# Create a contourf plot with specified levels
contour = plt.contourf(data, levels=levels, cmap='viridis')

plt.colorbar(contour)

plt.xlabel('Longitude')  # Change labels if necessary
plt.ylabel('Latitude')
plt.title('Relative humidity in NE Uganda at 1 of April 2023')
plt.show()
plt.savefig('rh_uganda1.eps')
