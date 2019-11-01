using KidesServer.Common;
using KidesServer.Helpers;
using KidesServer.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace KidesServer.Logic
{
	public static class FileLogic
	{
		public static FileUploadResult UploadFile(FileControllerPerson user, string tempFilePath, string newFileName, string baseurl)
		{
			try
			{
				var res = new FileUploadResult();

				var fullPath = $"{AppConfig.Config.FileAccess.RootDirectory}\\{newFileName}";
				if (File.Exists(fullPath))
				{
					res.success = false;
					res.message = "FILE_EXISTS";
					res.Files = null;
					return res;
				}
				File.Move(tempFilePath, fullPath);

				var fSplit = newFileName.Split("\\").ToList();
				var fName = fSplit.Last();
				fSplit.RemoveAt(fSplit.Count - 1);

				res.Files = new List<FileResult>
				{
					new FileResult()
					{
						FileName = Path.GetFileName(fullPath),
						Url = $"{baseurl}/api/v1/files/get-file/{fName}{(fSplit.Count != 0 ? $"?directory={string.Join('\\', fSplit)}" : "")}"
					}
				};
				res.success = true;
				res.message = string.Empty;
				return res;
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return new FileUploadResult()
				{
					success = false,
					message = ex.Message
				};
			}
		}

		public static ListDirectoryResult ListDirectory(FileControllerPerson user, string directory)
		{
			try
			{
				var res = new ListDirectoryResult();

				if (string.IsNullOrWhiteSpace(directory))
					directory = "\\";

				var (permission, subPermission) = CheckDirectoryPermission(user, directory);

				if (!permission)
					return new ListDirectoryResult() { success = false, message = "USER_NO_PERMISSIONS" };

				var fullPath = $"{AppConfig.Config.FileAccess.RootDirectory}\\{directory}";
				if (subPermission)
					res.Directories = Directory.EnumerateDirectories(fullPath).Select(x => x.Replace(AppConfig.Config.FileAccess.RootDirectory, "").TrimStart('\\')).ToList();
				else
					res.Directories = new List<string>();

				res.Files = Directory.EnumerateFiles(fullPath).Select(x => Path.GetFileName(x)).ToList();
				res.success = true;
				res.message = string.Empty;

				return res;
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return new ListDirectoryResult()
				{
					success = false,
					message = ex.Message
				};
			}
		}

		public static DirectoryInfoResult GetDirectoryInfo(FileControllerPerson user, string directory)
		{
			try
			{
				var res = new DirectoryInfoResult();

				var (permission, subPermission) = CheckDirectoryPermission(user, directory);

				if (!permission)
					return new DirectoryInfoResult() { success = false, message = "USER_NO_PERMISSIONS" };

				var fullPath = $"{AppConfig.Config.FileAccess.RootDirectory}\\{directory}";
				if (subPermission)
					res.Directories = Directory.EnumerateDirectories(fullPath).Select(x => x.Replace(AppConfig.Config.FileAccess.RootDirectory, "").TrimStart('\\')).ToList();
				else
					res.Directories = new List<string>();

				res.Files = Directory.EnumerateFiles(fullPath).Select(x => Path.GetFileName(x)).ToList();

				res.Name = Path.GetFileName(fullPath);
				res.Path = directory;
				res.SizeInBytes = 0;
				res.CreatedUtc = Directory.GetCreationTimeUtc(fullPath);
				res.LastModifiedUtc = Directory.GetLastWriteTimeUtc(fullPath);

				res.success = true;
				res.message = string.Empty;
				return res;
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return new DirectoryInfoResult()
				{
					success = false,
					message = ex.Message
				};
			}
		}

		public static FileInfoResult GetFileInfo(FileControllerPerson user, string fileName, string directory)
		{
			try
			{
				var res = new FileInfoResult();

				if (string.IsNullOrWhiteSpace(fileName))
					return new FileInfoResult() { success = false, message = "INVALID_PARAMS" };

				if (!string.IsNullOrWhiteSpace(directory))
					fileName = $"{directory}\\{fileName}";

				if (!CheckFilePermission(user, fileName))
					return new FileInfoResult() { message = "USER_NO_PERMISSIONS", success = false };

				var fullPath = $"{AppConfig.Config.FileAccess.RootDirectory}\\{fileName}";

				var fileInfo = new FileInfo(fullPath);

				res.Name = Path.GetFileName(fullPath);
				res.Path = fileName;
				res.SizeInBytes = fileInfo.Length;
				res.CreatedUtc = fileInfo.CreationTimeUtc;
				res.LastModifiedUtc = fileInfo.LastWriteTimeUtc;

				res.success = true;
				res.message = string.Empty;
				return res;
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return new FileInfoResult()
				{
					success = false,
					message = ex.Message
				};
			}
		}

		public static BaseResult DeleteFile(FileControllerPerson user, string fileName)
		{
			try
			{
				var res = new BaseResult();

				if (!CheckFilePermission(user, fileName))
				{
					res.success = false;
					res.message = string.Empty;
				}

				var fullPath = $"{AppConfig.Config.FileAccess.RootDirectory}\\{fileName}";
				File.Delete(fullPath);

				res.success = true;
				res.message = string.Empty;

				return res;
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return new BaseResult()
				{
					success = false,
					message = ex.Message
				};
			}
		}

		public static BaseResult DeleteDirectory(FileControllerPerson user, string directory)
		{
			try
			{
				var res = new BaseResult();

				if (string.IsNullOrWhiteSpace(directory) || directory == "\\" || directory == "/")
					return new BaseResult() { success = false, message = "CANNOT_DELETE_ROOT" };

				var (permission, subPermission) = CheckDirectoryPermission(user, directory);

				//If we dont have sub folder permissions make sure this folder is a directly controllable directory
				if (!permission || (!subPermission && !user.Directories.Contains(directory.ToLowerInvariant())))
					return new BaseResult() { success = false, message = "USER_NO_PERMISSIONS" };

				var fullPath = $"{AppConfig.Config.FileAccess.RootDirectory}\\{directory}";
				Directory.Delete(fullPath, true);

				res.success = true;
				res.message = string.Empty;

				return res;
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return new BaseResult()
				{
					success = false,
					message = ex.Message
				};
			}
		}

		public static bool CheckFilePermission(FileControllerPerson user, string fileName)
		{
			try
			{
				if (user.Directories.Contains("*") || user.Directories.Contains("\\*"))
					return true;

				var splitPath = fileName.Split('\\').ToList();
				if (splitPath.Count > 1)
				{
					splitPath.RemoveAt(splitPath.Count - 1);
					var dir = string.Join('\\', splitPath).ToLowerInvariant();
					foreach (var d in user.Directories)
					{
						var dl = d.ToLowerInvariant();
						if (dl.EndsWith("*"))
						{
							if (dir.Contains(dl.TrimEnd('*').TrimEnd('\\')))
								return true;
						}
						else
						{
							if (dir == dl)
								return true;
						}
					}
					return false;
				}
				else
				{
					if (!user.Directories.Contains("\\"))
						return false;
				}

				return true;
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return false;
			}
		}

		public static (bool permission, bool subPermission) CheckDirectoryPermission(FileControllerPerson user, string directory)
		{
			directory = directory.ToLowerInvariant();
			try
			{
				foreach (var d in user.Directories)
				{
					if (d == "*" || d == "\\*")
					{
						return (true, true);
					}

					var dl = d.ToLowerInvariant();
					if (dl.EndsWith("*"))
					{
						if (directory.Contains(dl.TrimEnd('*').TrimEnd('\\')))
						{
							return (true, true);
						}
					}
					else
					{
						if (directory == dl)
							return (true, false);
					}
				}

				return (false, false);
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return (false, false);
			}
		}
	}
}
