(blender-section)=

# Creating an .obj File in Blender

To create an .obj file we can use the popular open source application <a href="https://www.blender.org" target="_blank">Blender</a> (this is installed on the machines in the Dalton building).

1. Create your object in blender and sort out the material textures, UV coordinates etc. (lots of tutorials on youtube to help you with this). Or you can import a model produced by someone else (be sure to give credit if doing this).
   
2. Click on **File > Export > Wavefront (.obj)**

```{figure} ../_images/08_blender_export_obj_1.png
:width: 600
```

3. Make sure **Include Normals**, **Include UVs** and **Triangular Faces** are selected.


```{figure} ../_images/08_blender_export_obj_2.png
:width: 600
```

4. Navigate to your chosen folder e.g., **Computer-Graphics-Labs/assets/**, give it an appropriate name and lcik on **Export Wavefront OBJ**.

```{note}
The Model class that we are using in these labs is very simple and will only work with simple models. 
```
