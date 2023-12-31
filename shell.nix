
{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = let
      env = pyPkgs : with pyPkgs; [
        # autopep8
        cdsapi
        flask
        # flask-cors
      ];
    in with pkgs; [
      (python311.withPackages env)
      nodejs
      nodePackages.npm
      vite
    ];
}
