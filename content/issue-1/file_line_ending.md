

在不同平台间使用FTP软件传送文件时, 在ascii文本模式传输模式下, 一些FTP客户端程序会自动对换行格式进行转换. 经过这种传输的文件字节数可能会发生变化. 如果你不想ftp修改原文件, 可以使用bin模式(二进制模式)传输文本.

The line terminator expected for each file format is:

- unix	LF only (each line ends with an LF character).	Unix based systems and Mac OS X and later.
- dos	CRLF (each line ends with CR then LF).	DOS and Windows.
- mac	CR only (each line ends with a CR character).	Mac OS version 9 and earlier

CR is carriage return (return cursor to left margin), which is Ctrl-M or ^M or hex 0D.

LF is linefeed (move cursor down), which is Ctrl-J or ^J or hex 0A. Sometimes, LF is written as NL (newline).
