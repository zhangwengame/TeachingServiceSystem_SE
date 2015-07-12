# Cloud
## data store
```json
{
	uid: user id,
	tree : 
	[
		{
			text : file name or folder name;
			size : file size
			isFolder : 1/0 (is a Folder?)
			fid : the link file id
			children : folder have, an array [ ... ] just as tree 
		} 
		,...
	]
}
```
## opeartion
### move
just move json in tree
### delete
#### folder
	delete folder but (TODO) not recursive delete file
#### file
	delete file in tree and in gfs
### upload
	upload folder just make a folder in tree,
	
	upload a file in tree and in gfs;
### rename
	just rename in tree
### Download
	use fid
