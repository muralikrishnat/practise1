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
