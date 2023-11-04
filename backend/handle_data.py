import rioxarray
import xarray as xr


def nc_to_raster(filename):
    xds = xr.open_dataset(filename)
    print(xds)
    day1 = xds.r.sel(time='2022-02-12T14:00:00', method='nearest')
    day2 = xds.r.sel(time='2022-04-13T14:00:00', method='nearest')
    day3 = xds.r.sel(time='2022-05-13T14:00:00', method='nearest')
    print(day1)
    print(day2)
    print(day3)
    day1.rio.to_raster('C:\\Users\\Britta\\foodsafe\\FoodSafe\\backend\\map_data\\humidity\\2022-02-12.tif')
    day2.rio.to_raster('C:\\Users\\Britta\\foodsafe\\FoodSafe\\backend\\map_data\\humidity\\2022-04-13.tif')
    day3.rio.to_raster('C:\\Users\\Britta\\foodsafe\\FoodSafe\\backend\\map_data\\humidity\\2022-05-13.tif')


if __name__ == "__main__":
    nc_to_raster("uganda_humidity_2022.nc")
