#!/usr/bin/env python

# CS107 Submit Script
# Shamelessly stolen by dlwh for Linguist180 1/2009
# Authors: Justin Haugh and Abhishek Bajoria (and Susan Shepard)
# First written: 04/12/2003
#
# Key other setup:
# -create the submissions and submit_files directories before anyone
#  submits so that permissions will be inherited correctly
# -/usr/class/cs107/submissions must be created with system:anyuser li
# -/usr/class/cs107/bin/submit_files must be created with system:anyuser
#                                    rliwk
# -/usr/class/cs107/bin should be system:anyuser rl
# -requires
#           /usr/class/bin/assign_deadlines.txt with assignment deadline
#           info.  last line must have a RETURN or list of assignments
#           won't print out correctly!!!  Format is:
#           hwNum DueDate DueDateTime compile(yes|no) hwName inGroups(yes|no) filesToSubmit1,filesToSubmit2,filesToSubmit3,...
#      (no whitespace in the list of filesToSubmit)
#
#           /usr/class/bin/submit_files/TA_list.txt with names of TAs
#
# Updates:
# 04/20/2003 -- added assignment listing
# 09/29/2003 -- user chooses assignment now and submits from current
#               directory only.  Same student-ta for each assignment
#               shepard8 (Susan Shepard)
# 10/20/2003 -- modified to prompt user for a submit directory. Presents
#               a list of files that will be copied.  Loops until the
#               user accepts a list.  Will not allow a submission of
#               no files or an invalid directory
# 10/21/2003 -- modified to accept different assign_deadlines.txt format
#               hwNum DueDate DueDateTime compile(yes|no) hwName
#               whether compile occurs or not is now dependent on the assignment

import sys
import shutil
import pwd
import os
import re
import time
import math
import string
from subprocess import call

# Global Constants
CS107_HOME_DIR = "/afs/ir.stanford.edu/class/cs221"
CS107_SUBMIT_CONFIG_DIR = CS107_HOME_DIR + "/WWW" # system:anyuser rl
CS107_SUBMIT_DIR = CS107_HOME_DIR + "/submissions" # system:anyuser iw
ASSIGN_DEADLINES = CS107_SUBMIT_CONFIG_DIR + "/assign_deadlines.txt"

#TA_LIST = CS107_SUBMIT_CONFIG_DIR + "/TA_list.txt"
#TA_ASSIGNMENTS = CS107_SUBMIT_CONFIG_DIR + "/TA_assignments.txt"
#TA = "CS221_TA"

HOMEWORK = None
HOMEWORK_STRING = None
DUE_DATE = None
MAX_LATE_DAYS = 3


#-----------------------------------------------------------------
# subfunctions
#-----------------------------------------------------------------


#-----------------------------------------------------------------
# GetAssignmentInfo
#
# Get assignment record based on user input.
# If record exists in due dates file, return it.
# Otherwise, print error and quit.
#-----------------------------------------------------------------
def GetAssignmentInfo():
  
  # Find out which assignments can be turned in...
  dueDateFile = None
  
  try:
    dueDateFile = open(ASSIGN_DEADLINES, "r")
    dueDateMappings = dueDateFile.readlines()
    
  except IOError, e:
    print "ERROR reading the due date file: ", e
    print "Please contact the CS221 Staff immediately, and include the output of this script."
    sys.exit()
    
  dueDate = None
  dueDateFile.close()

  dueDateMappings.sort();
  
  print "****************************************************************\n"
  print "Which project are you submitting? " 
  for mapping in dueDateMappings:
    # each line contains: "hw# DueDate DueDateTime compile(yes|no) hwName filesToSubmit
    dueDateSplitted = string.split(mapping, None, 6)  
    if not dueDateSplitted:
      continue
      
    hwNum = dueDateSplitted[0]
    hwName = dueDateSplitted[4]
    print "  %s) %s" % (hwNum, hwName)
      
  ans = raw_input("\nEnter the assignment (p0, p1, ...; hw0, hw1 ...; -1 to quit): ")
  # Handle raw input
  if ans == -1:
    print "Exiting..."
    sys.exit()

  for mapping in dueDateMappings:
    dueDateSplitted = string.split(mapping, None, 6)
    if not dueDateSplitted:
      continue

    # had to convert both numbers to integers for correct comparison
    if ans == dueDateSplitted[0]:
      print "You are submitting %s (%s)" % (ans, dueDateSplitted[4])
      return dueDateSplitted
      break

  # if we get here, no matching assignment was found for input
  print "ERROR: No matching assignment found for ", ans,  "."
  print "Exiting...\n"
  sys.exit()
# end of GetAssignmentInfo()


#-----------------------------------------------------------------
# getSourceDirectory();
#
# prompts the user to enter a path.  Loops until she enters a 
# valid path.  Return the path and the list of files to copy as
# a tuple. Checks that the path exists and is a valid dir and then
# creates a list of matching files
#-----------------------------------------------------------------
def getSourceDirectory(filesToSubmit):
  # Get a regular expression pattern matcher to match files to copy 
  pattern = re.compile(r'\A[\w\-_]+\.(c|cc|cpp|h|java|scm|py)\Z|\AREADME\Z|\AMakefile\Z', re.IGNORECASE);

  # get the names of the files to submit
  filesToSubmit_names = string.split(string.strip(filesToSubmit), ",")
  
  print "****************************************************************\n"
  while 1:
    src = raw_input("Enter the path containing your submission files (press ENTER to use current directory): ")
    if src == '': src = '.'
    # if src begins with a ~, need to translate first.  expanduser is
    # no-op if src doesn't begin with a tilde
    src = os.path.expanduser(src)
    temp_path = os.path.abspath(src)  #translate to absolute

    if os.path.exists(temp_path) and os.path.isdir(temp_path):
      print "\nThe following files will be copied from %s:" % temp_path
      filesToCopy = [ ] 
      filesNotFound = [ ]
      files = os.listdir(temp_path)
      # look for the files you want
      for filename in filesToSubmit_names:
        found = False
        for file in files:
          if file == filename:
            filesToCopy.append(file)
            found = True
        if not found:
          filesNotFound.append(filename)
      #  matched = os.path.isfile(file)  #True #pattern.match(file)
      #  if (matched):
      #    filesToCopy.append(file)
      # check how many files were found to copy    
      if len(filesNotFound) > 0:
        print "Files not found in this directory : ", filesNotFound, ". Please try again."
      else: 
        for file in filesToCopy:
          print "  " + file
        ans = raw_input("\nIs this correct (yes/no)?  (Enter 'no' to choose another source directory.) ")
        if ans in ('y', 'yes'):
          return temp_path, filesToCopy  # user is satisfied, return the result
    else:
      # either source path doesn't exit or isn't a directory
      print temp_path, " is not a valid directory.  Please try again."
#end getSourceDirectory()

#-----------------------------------------------------------------
# getFeedbackAnswers();
#
# takes a list of tuples where there is one tuple per question.
# (min value, max value, question string)
#
# prompts the user to answer each question once.  Returns a list
# of the answers.  If the question is not answered or the value is
# out of range, just sets the value to 0.
#-----------------------------------------------------------------
if False:
  def getFeedbackAnswers(feedbackQuestions):
    answers = []
    for question in feedbackQuestions:
      try:
        ans = float(raw_input(question[2] + ' '))
        if (ans < question[0]) or (ans > question[1]):
          ans = 0.0
      except(TypeError, ValueError):
        ans = 0.0
      answers.append(ans)

    return answers
  #end getFeedbackAnswers
      
#-----------------------------------------------------------------
# Main (global) function
#-----------------------------------------------------------------

# Record the time of submission
# NOTE: this is off by an hour during DST, so you need to do the
# conversion found later (search for submitTimeString) before using
# it.
SUBMIT_TIME = time.time()



# Greeting message
print "\n------------- Welcome to the CS 221 Submit Script -------------\n"
print "If you are using this script on a machine other than corn,"
#print "epic, myth, fable, saga, or tree, please hit CTRL-C to cancel"
print "please hit CTRL-C to cancel"
print "this script, log into one of those machines and try again.\n"

#------------------------------------
# Get some relevant shell variables: student name, Leland ID, etc.
USERID = os.environ['USER']
STUDENT_NAME = pwd.getpwnam(USERID)[4]
HOST = os.environ['HOSTNAME']

# Identity check
print "\nYou are submitting for " + STUDENT_NAME + " from " + HOST
print "If you're not " + STUDENT_NAME + ", then log out and try again"
print "after logging into your own account.\n"


#------------------------------------
# determine assignment for submission
assignment = GetAssignmentInfo();

hwNum = assignment[0]
dueDatePartOne = assignment[1]
dueDatePartTwo = assignment[2]
testCompile = assignment[3]
hwName = assignment[4]
inGroups = assignment[5]
filesToSubmit = assignment[6]
dueDate = dueDatePartOne + " " + dueDatePartTwo
dueTime = time.strptime(dueDate, "%m/%d/%Y %H:%M:%S")

#calculate which assignments are acceptable...
# this is totally dumb but if you don't make the submit time
# into a string and then back to seconds, it's off by an hour.
# I'm sure it's a daylight savings time issue, but I can't
# get localtime() or time() to do the right thing.
submitTimeString = time.asctime(time.localtime(SUBMIT_TIME))
SUBMIT_TIME = time.mktime(time.strptime(submitTimeString, "%a %b %d %H:%M:%S %Y"))

diff = SUBMIT_TIME - time.mktime(dueTime)
daysDiff = math.ceil(diff/(3600*24))
  
# Check that the user can actually still submit for the chosen assignment
#if (daysDiff > MAX_LATE_DAYS):    
#  print "You have exceeded the max late days allowed on this assignment"
#  print "(14).  Please contact CS221 Staff if you believe this is a"
#  print "mistake. Exiting...\n"
#  sys.exit();


if diff < 0:
  lateDays = 0
else:
  lateDays = math.ceil(diff/(3600*24))

HOMEWORK = hwNum     
HOMEWORK_STRING = "Project " + hwNum + ": " + hwName

# clever python: getSourceDirectory returns a tuple of the path and files
# to copy list.  I can put two var names on lhs and tuple will be
# appropriately unpacked. woo!
path, filesToCopy = getSourceDirectory(filesToSubmit)

# Enter the student's names
if inGroups == 'yes':
  while True:
    src = raw_input("Who did you collaborate with (space-separated list of SUNetIDs, or ENTER if no one): ")
    ok = True
    students = []
    fullNames = []
    for name in src.split():
      try:
        fullName = pwd.getpwnam(name)[4]
        students.append(name)
        fullNames.append(fullName)
      except:
        print name, "is not recognized as a student's name. Please try again."
        ok = False
    if ok: break

# First, we create their submit directory

# Make the homework directory if it doesn't exist
HWdir = CS107_SUBMIT_DIR + "/" + HOMEWORK
if not os.path.exists(HWdir):
  try:
    os.mkdir(HWdir)
  except IOError, e:
    print "ERROR creating the " + HOMEWORK + " submission directory: " + HWdir
    print e
    print "Please contact the CS221 Staff immediately, and include the output of this script."
    sys.exit()

#------------------------------------
# Find out who their TA is: check the TA assignment file
#assignFile = None

#try:
#  if not os.path.exists(TA_ASSIGNMENTS):
#    assignFile = open(TA_ASSIGNMENTS, "w")
#    mappings = assignFile.readlines()
#  else:
#    assignFile = open(TA_ASSIGNMENTS, "r")
#    mappings = assignFile.readlines()
#except IOError, e:
#  print "ERROR reading the TA assignment file: ", e
#  print "Please contact the CS124 Staff immediately, and include the output of this script."
#  sys.exit()  

#assignFile.close()

#for mapping in mappings:
#  splitted = string.split(mapping)   # each line contains: "student ta"
#  if splitted:
#    student = splitted[0]
#    ta = splitted[1]
#    if student == USERID:
#      TA = ta
#      break

# If no TA assigned, then get them one
#if TA == None:
#  try:
#    # read the TA list
#    TA_file = open(TA_LIST, "r+")
#    lines = TA_file.readlines()
#    
#    # pick a TA for them    
#    num_TAs = string.atoi(string.split(lines[0], "=")[1])
#    next_TA = string.atoi(string.split(lines[1], "=")[1])
#    TA = string.strip(lines[next_TA + 2])
#    lines[1] = "Next_TA=" + str((next_TA + 1) % num_TAs) + "\n"
#    
#    # write out the file
#    TA_file.seek(0)
#    TA_file.writelines(lines)
#    TA_file.close()
#    
#    # add to the TA_assignments file
#    assignFile = open(TA_ASSIGNMENTS, "a")
#    assignFile.write("%s %s\n" % (USERID, TA))
#    assignFile.close()
#
#  except IOError, e:
#    print "ERROR during TA assignment: ", e
#    print "Please contact the CS221 Staff immediately, and include the output of this script."
#    sys.exit()


# Make the TA directory if it doesn't exist
#TAdir = CS107_SUBMIT_DIR + "/" + HOMEWORK + "/" + TA
TAdir = CS107_SUBMIT_DIR + "/" + HOMEWORK
if not os.path.exists(TAdir):
  try:
    os.mkdir(TAdir)
  except IOError, e:
    print "ERROR creating the TA submission directory: " + TAdir
    print e
    print "Please contact the CS221 Staff immediately, and include the output of this script."
    sys.exit()



# Try to make if marked for this assignment
if testCompile == 'yes':
  CURRENT_DIR = os.getcwd()
  os.chdir(path)
  print "Compiling your code to make sure there are no errors: \n"
  os.system("make clean")
  retval = os.system("make")
  os.chdir(CURRENT_DIR)
  print ""
  if retval == 0:
    print "Code compiled without any errors.\n"
  else: 
    print "WARNING: compilation errors in your submitted code, or no Makefile submitted."
    print "Please fix your compilation errors before submitting."
    sys.exit()
        
# Create the user's submit directory
i = 0
destDir = None
while 1:
  i = i + 1
  destDir = TAdir + "/" + USERID + "-" + str(i)
  if (not os.path.exists(destDir) and not os.path.exists(destDir + '-late')):
    if lateDays > MAX_LATE_DAYS:
      os.mkdir(destDir + '-late')
    else:
      os.mkdir(destDir)
    break

if lateDays > MAX_LATE_DAYS:
  destDir = destDir + '-late'

# used later for feedback (only allow feedback on first submission)
firstSubmission = 'yes'
if i > 1:
  firstSubmission = 'no'
  
# Copy their files
print "****************************************************************\n"
print "Copying files...\n"

# Copy source files to their submit directory
for file in filesToCopy:
  try:
    print "Copying file: " + file
    absoluteFileName = path + "/" + file    
    if os.path.isfile(absoluteFileName):
      if os.stat(absoluteFileName).st_size > 20*1024*1024:
        print "ERROR: File must be less than 20MB"
        sys.exit()
      shutil.copy(absoluteFileName, destDir + "/" + file)
    elif os.path.isdir(absoluteFileName):
      shutil.copytree(absoluteFileName, destDir + "/" + file)
    else:
      # I hate AFS
      in_file = open(absoluteFileName, 'r')
      out_file = open(destDir + "/" + file, 'w')
      out_file.write(in_file.read())
      out_file.flush()
      out_file.close()
  except IOError, e:
    print "ERROR during copying: ", e
    print "Please contact the CS221 Staff immediately, and include the output of this script."
    sys.exit()




# Create the GRADING file
gradeFile = open(destDir + "/GRADING", 'w')
gradeFile.write(USERID + "@stanford.edu" + "\n")
gradeFile.write(STUDENT_NAME + "\n\n")
if inGroups == 'yes':
  for name in students:
    gradeFile.write(name + "@stanford.edu" + "\n")
    gradeFile.write(pwd.getpwnam(name)[4] + "\n\n")
gradeFile.write(HOMEWORK_STRING + "\n")
gradeFile.write("Due date: " + dueDate + "\n")
gradeFile.write("Submitted at: " + submitTimeString + "\n")
gradeFile.write("Late days used: %d\n\n" % lateDays)
gradeFile.write("Grade: \n")
gradeFile.write("Comments: \n\n")
gradeFile.close()


# Print "SUCCESS" message
print "\n****************************************************************\n"
print "SUCCESS! " + STUDENT_NAME + " submitted " + HOMEWORK_STRING
print "at " + submitTimeString + ".  You used %d late days for this assignment." % lateDays

if lateDays > MAX_LATE_DAYS:
  print "\nYou have exceeded the max late days on this assignment (" + str(MAX_LATE_DAYS) + '). Your submission will'
  print "not be graded unless you have permission from the staff for late submission."

print ""
print "The contents of your submission directory are:"
print "> ls $GRADING_DIRECTORY"
call(['ls', destDir])

print "\n\nAll done!  Thanks a lot!"
