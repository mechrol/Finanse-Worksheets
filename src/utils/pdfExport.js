import jsPDF from 'jspdf'
import { format } from 'date-fns'

export const exportChecklistToPDF = (checklist, answers = {}) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  let yPosition = margin

  // Helper function to add text with word wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 12) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4)
  }

  // Helper function to check if we need a new page
  const checkNewPage = (requiredHeight) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
  }

  // Header
  doc.setFillColor(127, 0, 255) // Purple background
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255) // White text
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Checklist Analysis Report', margin, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, margin, 35)

  yPosition = 60

  // Checklist Title and Info
  doc.setTextColor(0, 0, 0) // Black text
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  yPosition = addWrappedText(checklist.title, margin, yPosition, pageWidth - 2 * margin, 18)
  
  yPosition += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100) // Gray text
  yPosition = addWrappedText(`Category: ${checklist.category}`, margin, yPosition, pageWidth - 2 * margin)
  yPosition = addWrappedText(`Video ID: ${checklist.videoId || 'N/A'}`, margin, yPosition, pageWidth - 2 * margin)
  
  yPosition += 5
  doc.setTextColor(0, 0, 0)
  yPosition = addWrappedText(checklist.description, margin, yPosition, pageWidth - 2 * margin)

  yPosition += 20

  // Statistics
  const totalAnswers = Object.keys(answers).length
  const yesAnswers = Object.values(answers).filter(answer => answer === 'yes').length
  const noAnswers = Object.values(answers).filter(answer => answer === 'no').length
  const completionRate = totalAnswers > 0 ? (totalAnswers / checklist.items.length * 100) : 0
  const positiveRate = totalAnswers > 0 ? (yesAnswers / totalAnswers * 100) : 0

  checkNewPage(80)

  // Statistics Box
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F')
  doc.setDrawColor(200, 200, 200)
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'S')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Analysis Summary', margin + 10, yPosition + 15)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  
  const statsY = yPosition + 30
  doc.text(`Completion Rate: ${completionRate.toFixed(0)}%`, margin + 10, statsY)
  doc.text(`Positive Responses: ${yesAnswers}`, margin + 10, statsY + 12)
  doc.text(`Areas to Improve: ${noAnswers}`, margin + 10, statsY + 24)
  doc.text(`Total Questions: ${checklist.items.length}`, margin + 10, statsY + 36)

  yPosition += 80

  // Questions and Answers
  checkNewPage(40)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Detailed Responses', margin, yPosition)
  yPosition += 20

  checklist.items.forEach((item, index) => {
    checkNewPage(50)

    // Question number and text
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}.`, margin, yPosition)
    
    doc.setFont('helvetica', 'normal')
    yPosition = addWrappedText(item.text, margin + 15, yPosition, pageWidth - 2 * margin - 15)
    
    yPosition += 5

    // Answer
    const answer = answers[item.id]
    if (answer) {
      doc.setFont('helvetica', 'bold')
      if (answer === 'yes') {
        doc.setTextColor(0, 150, 0) // Green
        doc.text('✓ YES', margin + 15, yPosition)
      } else {
        doc.setTextColor(200, 0, 0) // Red
        doc.text('✗ NO', margin + 15, yPosition)
      }
    } else {
      doc.setTextColor(150, 150, 150) // Gray
      doc.text('- Not Answered', margin + 15, yPosition)
    }

    // Habit indicator
    if (item.isHabit) {
      doc.setTextColor(255, 140, 0) // Orange
      doc.setFontSize(10)
      doc.text('[HABIT]', margin + 80, yPosition)
    }

    doc.setTextColor(0, 0, 0) // Reset to black
    yPosition += 15
  })

  // Habit Recommendations
  const habitItems = checklist.items.filter(item => 
    item.isHabit && answers[item.id] === 'no'
  )

  if (habitItems.length > 0) {
    checkNewPage(60)
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Recommended Habits to Develop', margin, yPosition)
    yPosition += 20

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    yPosition = addWrappedText(
      'Based on your responses, these habits could significantly improve your results. Consider starting a 30-day challenge for each habit.',
      margin, yPosition, pageWidth - 2 * margin
    )
    yPosition += 15

    habitItems.forEach((item, index) => {
      checkNewPage(30)
      
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.text(`${index + 1}.`, margin, yPosition)
      
      doc.setFont('helvetica', 'normal')
      yPosition = addWrappedText(item.text, margin + 15, yPosition, pageWidth - 2 * margin - 15)
      
      doc.setFontSize(10)
      doc.setTextColor(255, 140, 0)
      doc.text('→ 30-Day Challenge Available', margin + 15, yPosition + 5)
      
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      yPosition += 20
    })
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${totalPages} | Expense Tracker Pro - Checklist Analysis`,
      margin,
      pageHeight - 10
    )
  }

  // Save the PDF
  const fileName = `${checklist.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.pdf`
  doc.save(fileName)
}

export const exportAllChecklistsToPDF = (checklists, allAnswers = {}) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  let yPosition = margin

  // Helper functions (same as above)
  const addWrappedText = (text, x, y, maxWidth, fontSize = 12) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4)
  }

  const checkNewPage = (requiredHeight) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
  }

  // Header
  doc.setFillColor(127, 0, 255)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Complete Checklist Analysis Report', margin, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, margin, 35)

  yPosition = 60

  // Summary of all checklists
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', margin, yPosition)
  yPosition += 20

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  const totalChecklists = checklists.length
  const totalQuestions = checklists.reduce((sum, c) => sum + c.items.length, 0)
  const completedChecklists = checklists.filter(c => 
    allAnswers[c.id] && Object.keys(allAnswers[c.id]).length === c.items.length
  ).length

  yPosition = addWrappedText(`Total Checklists: ${totalChecklists}`, margin, yPosition, pageWidth - 2 * margin)
  yPosition = addWrappedText(`Completed Checklists: ${completedChecklists}`, margin, yPosition, pageWidth - 2 * margin)
  yPosition = addWrappedText(`Total Questions: ${totalQuestions}`, margin, yPosition, pageWidth - 2 * margin)

  yPosition += 20

  // Individual checklist summaries
  checklists.forEach((checklist, index) => {
    checkNewPage(100)
    
    const answers = allAnswers[checklist.id] || {}
    const totalAnswers = Object.keys(answers).length
    const yesAnswers = Object.values(answers).filter(answer => answer === 'yes').length
    const completionRate = totalAnswers > 0 ? (totalAnswers / checklist.items.length * 100) : 0

    // Checklist header
    doc.setFillColor(240, 240, 255)
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F')
    doc.setDrawColor(127, 0, 255)
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'S')

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    yPosition = addWrappedText(checklist.title, margin + 10, yPosition + 15, pageWidth - 2 * margin - 20, 14)
    
    yPosition += 20

    // Quick stats
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Category: ${checklist.category}`, margin + 10, yPosition)
    doc.text(`Completion: ${completionRate.toFixed(0)}%`, margin + 150, yPosition)
    doc.text(`Positive: ${yesAnswers}/${checklist.items.length}`, margin + 10, yPosition + 12)

    yPosition += 30
  })

  // Save the PDF
  doc.save('complete_checklist_analysis.pdf')
}
