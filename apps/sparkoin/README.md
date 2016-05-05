# A modern Scala Enviroment  based on Atom and Ensime

This branch installs a Scala enviroment composed of

- SBT: the de-facto standard scala build tool
- Atom: a modern, open source, hackable text editor
- Ensime: provides inspection features for Scala
- Jupyter: provides a remote command line tool 
- Hydrogen: Embeds Jupyter in Atom

Tested on OSX 10.10, Windows 10 and Ubuntu Linux.

## Notes for Windows 10

The scripts are bash and I do not even dream of providing alternative batch scripts, since also windows is moving towards provide bash too.

As a result you need a bash environment for Windows. Either install `Git for Windows` or `Docker Toolbook` (I used this one).

On windows 10 Hydrogen does not install, unless you have installed the Visual Studio Community  (I have not tried), but the rest works.

# PREREQUISITES:

Before starting, you need:

Python >2.7 in the path
Java >1.8 in the path
Atom >1.6 in the path

To use:

1. checkout the environment: `git clone -b using-ensime-with-atom http://github.com/sciabarra/ScalaGoodies`
1. execute `bin/install.sh`

The installer will install all the packages necessary for the kit to work.

Then you can start atom with `bin/atom.sh`

It will also automatically start `Ensime`

Check the blog post for what you can do.
