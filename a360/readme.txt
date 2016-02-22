User
    ID
    FName
    LName
    UName
    Pwd

Hub
    ID
    Name

Project
    HubID

ProjectMember
    ProjectID
    UserID
    UserType(Owner,Moderator,Guest)

HubMember
    HubID
    UserID
    UserType(Owner,Moderator,Guest)
    IsDefault

ProjectFile
    ID
    FileType
    StorageType(OSS)





================================================================================================
***************
------------------------------------------------------------------------------------------------

members has multiple hubs()
hubs can have multiple members(Owner, Admin, Guest)

Hub Member Type
    Owner - Can do any thing
    Admin - Can create Projects
    Guest - only can see all projects


================================================================================================

Action Manager
    1.SignUp
    2.Login

