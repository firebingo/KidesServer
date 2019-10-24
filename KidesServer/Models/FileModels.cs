using KidesServer.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KidesServer.Models
{
	public class FileUploadResult : BaseResult
	{
		public List<FileResult> Files;
	}

	public class FileResult
	{
		public string FileName;
		public string Url;
	}

	public class ListDirectoryResult : BaseResult
	{
		public List<string> Directories;
		public List<string> Files;
	}

	public class DirectoryInfoResult : ListDirectoryResult
	{
		public string Name;
		public string Path;
		public long SizeInBytes;
		public DateTime CreatedUtc;
		public DateTime LastModifiedUtc;
	}

	public class FileInfoResult : BaseResult
	{
		public string Name;
		public string Path;
		public long SizeInBytes;
		public DateTime CreatedUtc;
		public DateTime LastModifiedUtc;
	}
}
